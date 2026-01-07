import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { CustomLoader } from "../Component/CustomLoader";

const validationSchema = Yup.object({
  FirstName: Yup.string().required("First Name is required"),
  Email: Yup.string().email("Invalid email").required("Email is required"),
  Phone: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits"),

  Gender: Yup.string().required("Gender is required"),
  Dob: Yup.date().required("Date of Birth is required"),

  Department: Yup.string().required("Department is required"),
  Designation: Yup.string().required("Designation is required"),

  CurrentAddress: Yup.string().required("Current Address is required"),
  PermanentAddress: Yup.string().required("Permanent Address is required"),

  AadharNumber: Yup.string()
    .matches(/^[0-9]{12}$/, "Aadhar must be 12 digits")
    .required("Aadhar is required"),
  PanNumber: Yup.string().required("PAN Number is required"),

  BankName: Yup.string().required("Bank Name is required"),
  AccountNumber: Yup.string().required("Account Number is required"),
  IFSC: Yup.string().required("IFSC Code is required"),
  Branch: Yup.string().required("Branch is required"),

  EmergencyName: Yup.string().required("Emergency Name is required"),
  EmergencyRelation: Yup.string().required("Emergency Relation is required"),
  EmergencyPhone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Emergency Phone required"),

  Role: Yup.string().required("Role is required"),
});

const roles = ["ADMIN", "HR", "TL", "EMPLOYEE"];

const InputField = ({ label, name, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="font-medium">{label}</label>
    <Field type={type} name={name} className="p-2 border rounded" />
    <ErrorMessage name={name} component="p" className="text-red-500 text-sm" />
  </div>
);

export default function EditUser() {
  const imgRef = React.useRef(null);
  const [initialValues, setInitialValues] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("hrmsAuthToken")

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const user = data.user;

        setInitialValues({
          ...user,
          ...user.BankDetails,
          Profile: null, // file upload
        });

        setPreview(user.Profile_url);
      } catch (e) {
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const form = new FormData();

      // Include only allowed & schema-specific fields
      const allowed = [
        "FirstName",
        "LastName",
        "Email",
        "Phone",
        "Gender",
        "Dob",
        "Department",
        "Designation",
        "AadharNumber",
        "PanNumber",
        "CurrentAddress",
        "PermanentAddress",
        "EmergencyName",
        "EmergencyRelation",
        "EmergencyPhone",
        "Role",
      ];

      allowed.forEach((field) => {
        if (values[field] !== undefined) {
          form.append(field, values[field]);
        }
      });

      // Bank details (flat)
      form.append("BankName", values.BankName);
      form.append("AccountNumber", values.AccountNumber);
      form.append("IFSC", values.IFSC);
      form.append("Branch", values.Branch);

      // Image
      if (values.Profile) {
        form.append("Profile", values.Profile);
      }

      // PATCH request
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/update-user/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("User updated successfully");
        imgRef.current.value = null; // reset file input
        navigate(-1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!initialValues) return <CustomLoader />;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile Image */}
            <div className="md:col-span-2">
              <label className="font-medium">Profile Image</label>
              <input
                type="file"
                ref={imgRef}
                className="border p-2 rounded"
                accept="image/*"
                onChange={(e) => {
                  setFieldValue("Profile", e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
              {preview && (
                <img
                  draggable={false}
                  src={preview}
                  className="w-32 h-32 object-cover rounded mt-2"
                />
              )}
            </div>

            {/* Basic Fields */}
            <InputField label="First Name *" name="FirstName" />
            <InputField label="Last Name" name="LastName" />
            <InputField label="Email *" name="Email" />
            <InputField label="Phone" name="Phone" />
            <InputField label="DOB *" name="Dob" type="date" />

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Gender *</label>
              <div className="flex gap-4">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g}>
                    <Field type="radio" name="Gender" value={g} /> {g}
                  </label>
                ))}
              </div>
              <ErrorMessage
                name="Gender"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Job */}
            <InputField label="Department *" name="Department" />
            <InputField label="Designation *" name="Designation" />

            {/* Identity */}
            <InputField label="PAN Number *" name="PanNumber" />
            <InputField label="Aadhar Number *" name="AadharNumber" />

            {/* Bank */}
            <InputField label="Bank Name *" name="BankName" />
            <InputField label="Account Number *" name="AccountNumber" />
            <InputField label="IFSC *" name="IFSC" />
            <InputField label="Branch *" name="Branch" />

            {/* Emergency Contact */}
            <InputField label="Emergency Name *" name="EmergencyName" />
            <InputField label="Emergency Relation *" name="EmergencyRelation" />
            <InputField label="Emergency Phone *" name="EmergencyPhone" />

            {/* Role */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Role *</label>
              <Field as="select" name="Role" className="p-2 border rounded">
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option value={r} key={r}>
                    {r}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="Role"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <InputField
                label="Current Address *"
                name="CurrentAddress"
                as="textarea"
              />
            </div>

            <div className="md:col-span-2">
              <InputField
                label="Permanent Address *"
                name="PermanentAddress"
                as="textarea"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded"
              >
                {loading ? <CustomLoader /> : "Update User"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
