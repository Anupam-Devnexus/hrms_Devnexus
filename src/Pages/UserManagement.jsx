import React, { useEffect, useState } from "react";
import { useUserStore } from "../Zustand/GetAllData";
import EmployeeCard from "../Component/Card/EmployeeCard";
import { useNavigate } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

const UserManagement = () => {
  const navigate = useNavigate();
  const { allData, fetchAllData, deleteUser, loading, error } = useUserStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);
console.log(allData)
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const currentUserRole = authUser?.user?.Role?.toUpperCase();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
        Loading users...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-medium">
        Error: {error}
      </div>
    );

  const users = Object.values(allData.data || {}).flat();

  const counts = {
    ADMIN: users.filter((u) => u.Role?.toUpperCase() === "ADMIN").length,
    TEAMLEAD: users.filter((u) => u.Role?.toUpperCase() === "TL").length,
    EMPLOYEE: users.filter((u) => u.Role?.toUpperCase() !== "ADMIN").length,
  };
  const totalUsers = users.length;

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser._id, selectedUser.Role, currentUserRole);
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-wide">User Management</h2>
          <p className="mt-2 text-indigo-100">
            Manage admins, team leads, and employees
          </p>
        </div>
        {currentUserRole === "ADMIN" && (
          <button
            onClick={() => navigate("/dashboard/add-user")}
            className="mt-4 md:mt-0 px-6 py-2 bg-white text-indigo-700 font-semibold rounded-xl shadow hover:bg-indigo-100 transition"
          >
            + Add User
          </button>
        )}
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-xl font-bold text-red-600">{counts.ADMIN}</h3>
          <p className="text-gray-500 font-medium">Admins</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-xl font-bold text-purple-600">{counts.TEAMLEAD}</h3>
          <p className="text-gray-500 font-medium">Team Leads</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-xl font-bold text-pink-600">{counts.EMPLOYEE}</h3>
          <p className="text-gray-500 font-medium">Employees</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-xl font-bold text-green-600">{totalUsers}</h3>
          <p className="text-gray-500 font-medium">Total Users</p>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4"
            >
              <EmployeeCard employee={user} />

              {currentUserRole === "ADMIN" && (
                <div className="absolute bottom-18 right-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/edit-profile/${user._id}`)}
                    className=" rounded-full bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition shadow"
                  >
                    <AiFillEdit size={18} />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="rounded-full bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition shadow"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-600 text-lg font-medium">🚀 No users found</p>
            <p className="text-gray-400 text-sm">
              Add users to see them here.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedUser.FirstName} {selectedUser.LastName}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
