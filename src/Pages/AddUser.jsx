import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import menuConfig from "../DataStore/NavBar.json";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomLoader } from "../Component/CustomLoader";

// ---------------- Validation Schema ----------------
const validationSchema = Yup.object({
  FirstName: Yup.string().required("First Name is required"),
  // LastName: Yup.string().required("Last Name is required"),
  Email: Yup.string().email("Invalid email").required("Email is required"),
  Phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  // Salary: Yup.number()
  //   .typeError("Salary must be a number")
  //   .positive("Salary must be positive")
  //   .required("Salary is required"),

  Gender: Yup.string().required("Gender is required"),
  BankName: Yup.string().required("BankName is required"),
  AccountNumber: Yup.string()
    // .matches(/^[0-9]${10}/, "Phone must be 10 digits")
    .required("AccountNumber is required"),
  IFSC: Yup.string().required("IFSC is required"),
  Branch: Yup.string().required("Branch is required"),
  Dob: Yup.date().required("Date of Birth is required"),
  PanNumber: Yup.string().required("PanNumber must be 10 characters"),
  AadharNumber: Yup.string().matches(
    /^[0-9]{12}$/,
    "Aadhar Number must be 12 digits"
  ),
  Department: Yup.string().required("Department is required"),
  Designation: Yup.string().required("Designation is required"),
  PermanentAddress: Yup.string().required("PermanentAddress is required"),
  CurrentAddress: Yup.string().required("CurrentAddress is required"),
  Role: Yup.string().required("Role is required"),
  Password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  EmergencyPhone: Yup.string().matches(
    /^[0-9]{10}$/,
    "Emergency phone must be 10 digits"
  ),
  EmergencyName: Yup.string(),
  EmergencyRelation: Yup.string(),
});
// ---------------- Dropdown Options ----------------
const roles = ["ADMIN", "HR", "TL", "EMPLOYEE"];
const departments = ["IT", "HR", "Finance", "Sales", "Marketing", "Support"];
const designations = [
  "Software Engineer",
  "Team Lead",
  "Manager",
  "HR Executive",
  "Finance Executive",
  "Sales Associate",
];

// ---------------- Reusable Input ----------------
const InputField = ({ label, name, type = "text", ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-gray-700 font-medium">{label}</label>
    <Field
      type={type}
      name={name}
      {...props}
      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

// ---------------- Main Component ----------------
const AddUser = () => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { accessToken } = JSON.parse(localStorage.getItem("authUser"));

  const initialValues = {
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Dob: "",
    Department: "",
    Designation: "",
    PanNumber: "",
    AadharNumber: "",
    Gender: "",
    Salary: "",
    BankName: "",
    AccountNumber: "",
    IFSC: "",
    Branch: "",
    Role: "",
    Permissions: [],
    PermanentAddress: "",
    CurrentAddress: "",
    EmergencyPhone: "",
    JoiningDate: "",
    EmergencyName: "",
    EmergencyRelation: "",
    Password: "",
    AllowedTabs: menuConfig.common.map((c) => c.label),
    Profile: null,
  };

  const getRoleMenu = (role) =>
    role ? menuConfig[role.toLowerCase()] || [] : [];

  const handleImageUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("Profile", file); // store File object directly
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (["Permissions", "AllowedTabs"].includes(key)) {
          data.append(key, JSON.stringify(val));
        } else if (key === "Profile" && val) {
          data.append("Profile", val);
        } else {
          data.append(key, val);
        }
      });

      // console.log(accesstoken)

      console.log(" Final Payload:", Object.fromEntries(data));
      // return;
      const { data: data1 } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/add-employee`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(data1);

      if (!data1.success) throw new Error("Failed to add employee");

      // const result = await response.json();
      toast.success(" Employee added successfully!");
      // console.log("API Response:", result);
      setLoading(false);

      resetForm();
      setPreview(null);
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error(err.response.data.message);
      // alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-2">
      <div className="bg-white rounded-2xl p-8 w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:underline"
          >
            Back
          </button>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <InputField label="First Name *" name="FirstName" />
              <InputField label="Last Name *" name="LastName" />
              <InputField label="Email *" name="Email" type="email" />
              <InputField label="Salary " name="Salary" type="number" />
              <InputField label="Phone *" name="Phone" />
              <InputField label="Date of Birth *" name="Dob" type="date" />

              <div className="flex items-center  gap-4">
                <h2 className="font-semibold mb-2">Select Gender *</h2>
                <label>
                  <Field type="radio" name="Gender" value="Male" />
                  Male
                </label>
                <label>
                  <Field type="radio" name="Gender" value="Female" />
                  Female
                </label>
                <label>
                  <Field type="radio" name="Gender" value="Other" />
                  Other
                </label>
              </div>

              <InputField
                label="Date of Joining *"
                name="JoiningDate"
                type="date"
              />
              <InputField label="Department *" name="Department" />
              <InputField label="Designation *" name="Designation" />
              <InputField label="PAN Number *" name="PanNumber" />
              <InputField label="Aadhar Number *" name="AadharNumber" />

              {/* <InputField label="Salary *" name="Salary" /> */}
              <InputField label="BankName *" name="BankName" />
              <InputField
                label="Account Number *"
                name="AccountNumber"
                type="text"
              />
              <InputField label="IFSC Code*" name="IFSC" />
              <InputField label="Branch *" name="Branch" />

              {/* Dropdowns */}
              {/* <InputField as="select" label="Department *" name="Department">
                <option value="">Select Department</option>
                {departments.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </InputField> */}

              {/* <InputField as="select" label="Designation *" name="Designation">
                <option value="">Select Designation</option>
                {designations.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </InputField> */}

              <InputField as="select" label="Role *" name="Role">
                <option value="">Select Role</option>
                {roles.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </InputField>

              {/* Allowed Tabs */}
              {/* <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Allowed Tabs (Common)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {menuConfig.common.map((item) => (
                    <label key={item.label} className="flex items-center gap-2">
                      <Field
                        type="checkbox"
                        name="AllowedTabs"
                        value={item.label}
                        className="accent-blue-600"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div> */}

              {/* Permissions */}
              {/* {values.Role && (
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Permissions ({values.Role})
                  </label>
                  <div className="space-y-2">
                    {getRoleMenu(values.Role).map((item) => (
                      <div key={item.label} className="border rounded-lg p-3">
                        <label className="flex items-center gap-2 font-medium">
                          <Field
                            type="checkbox"
                            name="Permissions"
                            value={item.label}
                            className="accent-blue-600"
                          />
                          {item.label}
                        </label>
                        {item.children && (
                          <div className="ml-6 mt-2 space-y-1">
                            {item.children.map((child) => (
                              <label
                                key={child.label}
                                className="flex items-center gap-2"
                              >
                                <Field
                                  type="checkbox"
                                  name="Permissions"
                                  value={`${item.label} > ${child.label}`}
                                  className="accent-blue-600"
                                />
                                {child.label}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              {/* Address */}
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-gray-700 font-medium">
                  Current Address
                </label>
                <Field
                  as="textarea"
                  name="CurrentAddress"
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-gray-700 font-medium">
                  Permanent Address
                </label>
                <Field
                  as="textarea"
                  name="PermanentAddress"
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Emergency Details */}
              <h2 className="md:col-span-2 text-xl font-semibold text-gray-800 mt-4">
                Emergency Details
              </h2>
              <InputField name="EmergencyPhone" label="Emergency Phone" />
              <InputField name="EmergencyName" label="Emergency Contact Name" />
              <InputField name="EmergencyRelation" label="Emergency Relation" />

              {/* Password */}
              <InputField label="Password *" name="Password" type="password" />

              {/* Profile Image */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-gray-700 font-medium">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setFieldValue)}
                  className="border p-2 rounded-lg cursor-pointer"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 rounded-md object-cover border"
                  />
                )}
              </div>

              {/* Submit */}
              <div className="md:col-span-2 mt-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Employee {loading && <CustomLoader />}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUser;
