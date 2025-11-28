import React, { useState } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { TextInput, TextArea } from "../Component/Form/Inputs"; // adjust path if needed

// Date helpers: leave must be applied at least 14 days in advance
const computeMinFromDate = () => {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 14);
  return minDate.toISOString().split("T")[0]; // yyyy-mm-dd
};

const minFromDate = computeMinFromDate();

// Validation schema
const validationSchema = Yup.object({
  type: Yup.string().required("Leave type is required"),
  fromDate: Yup.date()
    .required("Start date is required")
    .min(minFromDate, "Leave can only be applied at least 2 weeks in advance"),
  toDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("fromDate"), "End date cannot be before start date"),
  reason: Yup.string()
    .required("Reason is required")
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must be under 500 characters"),
});

// Formik-aware wrappers around your reusable inputs
const FormikTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <TextInput
      label={label}
      {...field}
      {...props}
      error={meta.touched && meta.error ? meta.error : ""}
    />
  );
};

const FormikTextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <TextArea
      label={label}
      {...field}
      {...props}
      error={meta.touched && meta.error ? meta.error : ""}
    />
  );
};

const FormikSelect = ({ label, children, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1 text-sm">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        {...field}
        {...props}
        className={`w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:outline-none ${
          meta.touched && meta.error
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-300 focus:ring-indigo-400"
        }`}
      >
        {children}
      </select>
      {meta.touched && meta.error && (
        <p className="text-red-500 text-xs mt-1">{meta.error}</p>
      )}
    </div>
  );
};

const ApplyLeave = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const token = authUser?.accessToken;

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const initialValues = {
    type: "",
    fromDate: "",
    toDate: "",
    reason: "",
  };

  if (!authUser) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        You must be logged in to apply for leave.
      </div>
    );
  }

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      leaveType: values.type,
      from: values.fromDate,
      to: values.toDate,
      reason: values.reason.trim(),
    };

    try {
      setLoading(true);
      setSubmitError("");
      setSubmitSuccess("");

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/leave/apply-leave`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit leave");
      }

      resetForm();
      setSubmitSuccess("Leave application submitted successfully.");
    } catch (err) {
      console.error("Error applying leave:", err);
      setSubmitError(
        err.message || "Error submitting leave application. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const user = authUser.user || {};

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Apply for leave
        </h1>
        <button
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
          onClick={() => window.history.back()}
        >
          Back
        </button>
      </div>

      {/* User info */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Employee details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm sm:text-[13px]">
          <p>
            Name: {user.FirstName} {user.LastName}
          </p>
          <p>Email: {user.Email}</p>
          <p>Department: {user.Department}</p>
          <p>Employee ID: {user.EmployeeId}</p>
          <p>Role: {user.Role?.toUpperCase()}</p>
        </div>
      </div>

      {/* Global messages */}
      {submitError && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {submitSuccess}
        </div>
      )}

      {/* Form */}
      <div className="bg-white shadow-xl rounded-2xl p-5 sm:p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Leave type */}
              <FormikSelect name="type" label="Leave type">
                <option value="">Select leave type</option>
                <option value="Sick">Sick</option>
                <option value="Casual">Casual</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Maternity">Maternity</option>
                <option value="Other">Other</option>
              </FormikSelect>

              {/* From and To dates in one row on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormikTextInput
                  label="From date"
                  name="fromDate"
                  type="date"
                  required
                  min={minFromDate}
                  error={undefined} // handled inside FormikTextInput via meta
                  hint={`Leave must start on or after ${minFromDate}`}
                />

                <FormikTextInput
                  label="To date"
                  name="toDate"
                  type="date"
                  required
                />
              </div>

              {/* Reason */}
              <FormikTextArea
                label="Reason"
                name="reason"
                required
                rows={4}
                maxLength={500}
                showCounter
                placeholder="Enter reason for leave"
              />

              {/* Submit */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`px-6 py-2 rounded-lg shadow-md font-medium text-white text-sm sm:text-base transition ${
                    isSubmitting || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isSubmitting || loading ? "Submitting..." : "Apply leave"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ApplyLeave;
