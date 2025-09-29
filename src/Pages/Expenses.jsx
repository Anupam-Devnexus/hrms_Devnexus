// Expenses.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Expenses = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser"))?.user;
  const Role = authUser?.Role;
  const token = JSON.parse(localStorage.getItem("authUser"))?.accessToken;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    description: "",
  });

  // Fetch expenses for ADMIN
  useEffect(() => {
    if (Role === "ADMIN") fetchExpenses();
  }, [Role]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://hrms-backend-9qzj.onrender.com/api/expense/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses(res?.data?.expenses); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Expense:", formData);

    if (!formData.title || !formData.amount) {
      toast.warn("Title and Amount are required.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://hrms-backend-9qzj.onrender.com/api/expense/",
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Expense added successfully!");
      setFormData({ title: "", amount: "", description: "" });

      if (Role === "ADMIN") fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="text-3xl font-bold text-[var(--primary-color)]">
        {Role === "ADMIN" ? "All Expenses" : "Add Expense"}
      </h2>

      {/* HR: Add Expense Form */}
      {Role === "HR" && (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Expense"}
            </button>
          </form>
        </div>
      )}

      {/* ADMIN: View Expenses Table */}
      {Role === "ADMIN" && (
        <div className="overflow-x-auto rounded-lg bg-white shadow-lg p-4">
          {loading ? (
            <div className="p-4 flex justify-center items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading expenses...
            </div>
          ) : (
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-800 font-medium">
                <tr>
                  <th className="py-2 px-4 border">Title</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Description</th>
                  <th className="py-2 px-4 border">Created By</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length ? (
                  expenses.map((exp) => (
                    <tr key={exp._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border">{exp.title}</td>
                      <td className="py-2 px-4 border">{exp.amount}</td>
                      <td className="py-2 px-4 border">{exp.description}</td>
                      <td className="py-2 px-4 border">
                        {exp.createdBy?.FirstName} {exp.createdBy?.LastName}
                      </td>
                      <td className="py-2 px-4 border">{exp.createdBy?.Role}</td>
                      <td className="py-2 px-4 border">
                        {new Date(exp.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      No expenses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Expenses;
