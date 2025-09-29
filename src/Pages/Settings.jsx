import React, { useState, useEffect } from "react";
import Data from "../DataStore/ticketData.json";
import axios from "axios";

const Settings = () => {
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("authUser"))?.user;
  const Role = user?.Role;

  console.log("User Role:", Role, user);

  // State for ticket form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
  });

  // State for API call feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit and post to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Replace with your API endpoint
      const response = await axios.post("/api/tickets", {
        ...formData,
        raisedBy: `${user.FirstName} ${user.LastName}`,
        status: "Open",
        createdAt: new Date().toISOString(),
      });

      setMessage("Ticket Raised Successfully!");
      console.log("API Response:", response.data);

      // Reset form
      setFormData({ title: "", description: "", priority: "Low" });
    } catch (error) {
      console.error("Error raising ticket:", error);
      setMessage("Failed to raise ticket. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get badge color based on priority
  const priorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-200 text-red-800";
      case "Medium":
        return "bg-yellow-200 text-yellow-800";
      case "Low":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-2 max-w-6xl mx-auto space-y-8">
      <h2 className="text-4xl font-bold text-center mb-6">Settings Page</h2>

      {/* ADMIN Section: List of Tickets */}
      {Role === "ADMIN" ? (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">All Tickets</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Data.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 border rounded-lg shadow hover:shadow-lg transition bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg">{ticket.title}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${priorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{ticket.description}</p>
                <p className="text-sm text-gray-500 mb-1">
                  Status: <span className="font-medium">{ticket.status}</span>
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Raised By: {ticket.raisedBy} | Assigned To: {ticket.assignedTo}
                </p>
                <p className="text-xs text-gray-400">
                  Created At: {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Non-admin Section: Ticket Raise Form
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Raise a Ticket</h3>

          {message && (
            <div
              className={`p-2 rounded text-center ${message.includes("Successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-gray-50 p-6 rounded-lg shadow"
          >
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              ></textarea>
            </div>
            <div>
              <label className="block mb-1 font-medium">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>
      )}

      {/* User Info Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-2xl font-semibold mb-4">User Info</h3>
        <p>
          <strong>Name:</strong> {user?.FirstName} {user?.LastName}
        </p>
        <p>
          <strong>Department:</strong> {user?.Department}
        </p>
        <p>
          <strong>Email:</strong> {user?.Email}
        </p>
        <p>
          <strong>Role:</strong> {Role}
        </p>
      </div>
    </div>
  );
};

export default Settings;
