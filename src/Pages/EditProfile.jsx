import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import menuConfig from "../DataStore/NavBar.json"; // 👈 import nav config

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null); // for profile preview

  // Fetch Employee Data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://hrms-backend2.onrender.com/api/user/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch employee data");

        const data = await res.json();
        console.log("✅ Employee Data:", data);
        setEmployee(data.user);
        setPreview(data.user.Profile_url);
      } catch (err) {
        console.error("❌ Error fetching employee:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Upload (Profile Picture)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    // upload to Cloudinary or backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_unsigned_preset"); // 👈 replace

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/sahil-kumar/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      console.log("✅ Uploaded Image:", data);

      setEmployee((prev) => ({
        ...prev,
        Profile_url: data.secure_url,
        Profile_Public_id: data.public_id,
      }));
    } catch (err) {
      console.error("❌ Error uploading image:", err);
    }
  };

  // Handle Permission Checkbox Change
  const handlePermissionToggle = (permission) => {
    setEmployee((prev) => {
      const exists = prev.Permissions.includes(permission);
      return {
        ...prev,
        Permissions: exists
          ? prev.Permissions.filter((p) => p !== permission)
          : [...prev.Permissions, permission],
      };
    });
  };

  // Get available permissions from role
  const getRolePermissions = () => {
    if (!employee?.Role) return [];
    let role = employee.Role.toLowerCase();
    let roleTabs = [];

    // merge common + role-specific
    if (menuConfig.common) {
      roleTabs = [
        ...roleTabs,
        ...menuConfig.common.map((item) => item.label),
      ];
    }

    if (menuConfig[role]) {
      menuConfig[role].forEach((section) => {
        if (section.label) roleTabs.push(section.label);
        if (section.children) {
          roleTabs = [...roleTabs, ...section.children.map((c) => c.label)];
        }
      });
    }
    return roleTabs;
  };

  // Handle Form Submit (PATCH)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch(
        `https://hrms-backend2.onrender.com/api/user/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employee),
        }
      );
      if (!res.ok) throw new Error("Failed to update employee");

      const updated = await res.json();
      console.log("✅ Updated Employee:", updated);
      alert("Profile updated successfully!");
      navigate("/employees");
    } catch (err) {
      console.error("❌ Error updating employee:", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading employee data...</p>;
  if (!employee) return <p className="p-6 text-red-500">Employee not found</p>;

  const rolePermissions = getRolePermissions();

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="flex items-center gap-6">
          <img
            src={preview}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <label className="block text-sm font-medium mb-2">Change Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Employee ID: {employee.EmployeeId}
            </p>
          </div>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-2 gap-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="FirstName"
              value={employee.FirstName || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="LastName"
              value={employee.LastName || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="Email"
              value={employee.Email || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="Phone"
              value={employee.Phone || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              name="Dob"
              value={employee.Dob ? employee.Dob.split("T")[0] : ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Joining Date</label>
            <input
              type="date"
              name="JoiningDate"
              value={employee.JoiningDate ? employee.JoiningDate.split("T")[0] : ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Department</label>
            <input
              type="text"
              name="Department"
              value={employee.Department || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Designation</label>
            <input
              type="text"
              name="Designation"
              value={employee.Designation || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="Role"
              value={employee.Role || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="HR">HR</option>
              <option value="TL">TL</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium">Address</label>
            <textarea
              name="Address"
              value={employee.Address || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Permissions Section */}
        <div>
          <label className="block text-sm font-medium mb-2">Permissions</label>
          <div className="grid grid-cols-2 gap-2 border p-3 rounded-lg">
            {rolePermissions.map((perm) => (
              <label key={perm} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={employee.Permissions?.includes(perm)}
                  onChange={() => handlePermissionToggle(perm)}
                />
                {perm}
              </label>
            ))}
          </div>
        </div>

        {/* Emergency Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Emergency Name</label>
            <input
              type="text"
              name="EmergencyName"
              value={employee.EmergencyName || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Relation</label>
            <input
              type="text"
              name="EmergencyRelation"
              value={employee.EmergencyRelation || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Emergency Phone</label>
            <input
              type="text"
              name="EmergencyPhone"
              value={employee.EmergencyPhone || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="IsActive"
            checked={employee.IsActive}
            onChange={(e) =>
              setEmployee((prev) => ({ ...prev, IsActive: e.target.checked }))
            }
          />
          <label className="text-sm">Active</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
