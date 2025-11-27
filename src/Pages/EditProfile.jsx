import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import menuConfig from "../DataStore/NavBar.json";
import { CustomLoader } from "../Component/CustomLoader";

const validationSchema = Yup.object({
  FirstName: Yup.string().required("First Name is required"),
  Email: Yup.string().email("Invalid email").required("Email is required"),
  Phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  Gender: Yup.string().required("Gender is required"),
  BankName: Yup.string().required("Bank Name is required"),
  AccountNumber: Yup.string().required("Account Number is required"),
  IFSC: Yup.string().required("IFSC is required"),
  Branch: Yup.string().required("Branch is required"),
  Dob: Yup.date().required("Date of Birth is required"),
  PanNumber: Yup.string().required("PAN Number is required"),
  AadharNumber: Yup.string().matches(/^[0-9]{12}$/, "Aadhar must be 12 digits"),
  Department: Yup.string().required("Department is required"),
  Designation: Yup.string().required("Designation is required"),
  PermanentAddress: Yup.string().required("Permanent Address is required"),
  CurrentAddress: Yup.string().required("Current Address is required"),
  Role: Yup.string().required("Role is required"),
});

const roles = ["ADMIN", "HR", "TL", "EMPLOYEE"];

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

const EditUser = () => {
  const [initialValues, setInitialValues] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); // user ID from URL
  const navigate = useNavigate();
  const { accessToken } = JSON.parse(localStorage.getItem("authUser"));

  const getRoleMenu = (role) =>
    role ? menuConfig[role.toLowerCase()] || [] : [];

  // Fetch existing user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const user = data.user;
        console.log(user);
        setInitialValues({
          ...user,
          ...user.BankDetails,
          Profile: null,
        });
        setPreview(user.Profile_url);
      } catch (err) {
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleImageUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("Profile", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values) => {
    console.log("values", values);
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (key === "Profile" && val) {
          data.append("Profile", val);
        } else {
          data.append(key, val);
        }
      });
      console.log("data", data);

      const { data: res } = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/update-user/${id}`,
        data,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log("response", res);

      if (!res.success) throw new Error("Failed to update employee");
      toast.success("Employee updated successfully!");
      navigate("/employees");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!initialValues) return <CustomLoader />;

  return (
    <div className="min-h-screen flex justify-center items-center p-2">
      <div className="bg-white rounded-2xl p-8 w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Employee</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            Back
          </button>
        </div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Basic Info */}
              <InputField label="First Name *" name="FirstName" />
              <InputField label="Last Name" name="LastName" />
              <InputField label="Email *" name="Email" type="email" />
              <InputField label="Phone *" name="Phone" />
              <InputField label="Date of Birth *" name="Dob" type="date" />

              <div className="flex items-center gap-4">
                <h2 className="font-semibold mb-2">Gender *</h2>
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g}>
                    <Field type="radio" name="Gender" value={g} />
                    {g}
                  </label>
                ))}
              </div>

              <InputField label="Department *" name="Department" />
              <InputField label="Designation *" name="Designation" />
              <InputField label="PAN Number *" name="PanNumber" />
              <InputField label="Aadhar Number *" name="AadharNumber" />
              <InputField label="Bank Name *" name="BankName" />
              <InputField label="Account Number *" name="AccountNumber" />
              <InputField label="IFSC Code *" name="IFSC" />
              <InputField label="Branch *" name="Branch" />

              <InputField as="select" label="Role *" name="Role">
                <option value="">Select Role</option>
                {roles.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </InputField>

              {/* Allowed Tabs
              <div className="md:col-span-2">
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

              <div className="md:col-span-2 mt-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Update Employee {loading && <CustomLoader />}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditUser;
