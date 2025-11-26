import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Settings = () => {
  // Get logged-in user
  const {
    user,
    user: { Role },
    accessToken,
  } = JSON.parse(localStorage.getItem("authUser"));
  // const Role = user?.Role;

  // console.log("User Role:", accessToken );

  // State for ticket form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
  });

  // State for API call feedback
  const [tickets, setTicket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://hrms-backend-9qzj.onrender.com/api/ticket/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(data);
        setTicket(data.tickets);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    })();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const ackTicket = async (_id) => {
    setLoading(true);
    try {
      const { data } = await axios.patch(
        `https://hrms-backend-9qzj.onrender.com/api/ticket/${_id}`,
        { status: "Acknowledged" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(data);

      setTicket((prev) =>
        prev.map((ticket) => {
          if (ticket._id === _id) {
            ticket.status = "Acknowledged";
            return ticket;
          } else {
            return ticket;
          }
        })
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit and post to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Replace with your API endpoint
      const { data } = await axios.post(
        "https://hrms-backend-9qzj.onrender.com/api/ticket/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(data);
      const newTicket = data.newTicket;
      setMessage("Ticket Raised Successfully!");
      // console.log("API Response:", data);
      setTicket((prev) => [...prev, newTicket]);
      console.log(tickets);
      // Reset form
      setFormData({ title: "", description: "", priority: "Low" });
    } catch (error) {
      console.error("Error raising ticket:", error);
      setMessage("Failed to raise ticket. Try again.");
    } finally {
      setLoading(false);
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
            {tickets.length !== 0 &&
              tickets.map((ticket) => (
                <div
                  key={ticket._id}
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
                  {/* <p className="text-sm text-gray-500 mb-1">
                    Status: <span className="font-medium">{ticket.status}</span>
                  </p> */}
                  <p className="text-sm text-gray-500 mb-1">
                    Raised By: {ticket.createdBy.FirstName}{" "}
                    {ticket.createdBy.LastName}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created At: {new Date(ticket.createdAt).toLocaleString()}
                  </p>

                  <button
                    disabled={loading || ticket.status === "Acknowledged"}
                    onClick={() => ackTicket(ticket._id)}
                    style={{
                      cursor:
                        ticket.status === "Acknowledged" || loading
                          ? "not-allowed"
                          : "pointer",
                      background: ticket.status === "Acknowledged" && "green",
                    }}
                    className="bg-blue-700 my-2 text-white"
                  >
                    {ticket.status !== "Acknowledged" ? "Ack" : "Acknowledged"}
                  </button>
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
              className={`p-2 rounded text-center ${
                message.includes("Successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
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
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 resize-none rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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

          <div>
            <h3 className="text-2xl font-semibold my-3 ">
              Your Ticket History
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {tickets?.map((ticket) => (
                <div
                  key={ticket._id}
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
                  {/* <p className="text-sm text-gray-500 mb-1">
                    Raised By: {ticket.createdBy.FirstName}{" "}
                    {ticket.createdBy.LastName}
                    {ticket.raisedBy}
                  </p> */}
                  <p className="text-xs text-gray-400">
                    Created At: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
