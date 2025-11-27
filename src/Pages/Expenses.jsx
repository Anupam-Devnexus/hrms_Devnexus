// Expenses.jsx
import { useEffect, useState } from "react";
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
    dueDate: "",
  });

  // Fetch expenses for ADMIN
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/expense/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res?.data?.expenses);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
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
        `${import.meta.env.VITE_BASE_URL}/expense/`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Expense added successfully!");
      setFormData({ title: "", amount: "", description: "" });

      fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  const ChangeStatus = async (status, id) => {
    setLoading(true);
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/expense/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) toast.success(data.message);
      // setFormData({ title: "", amount: "", description: "" });

      if (Role === "ADMIN") fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
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
        <div>
          <div className="bg-white shadow-lg rounded-lg p-6  mx-auto">
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
              <div className="mb-2">
                <label htmlFor="">
                  Due Date
                  <input
                    type="date"
                    placeholder="Due Date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                  />
                </label>
              </div>

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
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Add Expense"
                )}
              </button>
            </form>
          </div>
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
                    <th className="py-2 px-4 border">No.</th>
                    <th className="py-2 px-4 border">Title</th>
                    <th className="py-2 px-4 border">Amount</th>
                    <th className="py-2 px-4 border">Description</th>
                    <th className="py-2 px-4 border">Created By</th>
                    <th className="py-2 px-4 border">Created At</th>
                    <th className="py-2 px-4 border">Due Date</th>
                    <th className="py-2 px-4 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length ? (
                    expenses.map((exp, index) => (
                      <tr key={exp._id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{index + 1}</td>
                        <td className="py-2 px-4 border">{exp.title}</td>
                        <td className="py-2 px-4 border">{exp.amount}</td>
                        <td
                          style={
                            {
                              // overflowY:"scroll"
                            }
                          }
                          className=" exp-table-desc py-2 px-4 border "
                        >
                          {exp.description}
                        </td>

                        <td className="py-2 px-4 border">
                          {exp.createdBy?.FirstName} {exp.createdBy?.LastName}
                        </td>
                        <td className="py-2 px-4 border">
                          {new Date(exp.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 border">
                          {exp?.dueDate ||
                            new Date(exp.createdAt).toLocaleString}
                        </td>
                        <td className="py-2 px-4 border">
                          <button
                            style={{
                              cursor: "text",
                            }}
                            className={`  ${
                              exp.status == "REJECTED"
                                ? "bg-red-500"
                                : exp.status == "PAID"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {exp.status}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-center text-gray-500"
                      >
                        No expenses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
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
                  <th className="py-2 px-4 border">No.</th>
                  <th className="py-2 px-4 border">Title</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Description</th>
                  <th className="py-2 px-4 border">Created By</th>
                  <th className="py-2 px-4 border">Created At</th>
                  <th className="py-2 px-4 border">Due Date</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length ? (
                  expenses.map((exp, index) => (
                    <tr key={exp._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border">{index + 1}</td>
                      <td className="py-2 px-4 border">{exp.title}</td>
                      <td className="py-2 px-4 border">{exp.amount}</td>
                      <td
                        style={
                          {
                            // overflowY:"scroll"
                          }
                        }
                        className=" exp-table-desc py-2 px-4 border "
                      >
                        {exp.description}
                      </td>

                      <td className="py-2 px-4 border">
                        {exp.createdBy?.FirstName} {exp.createdBy?.LastName}
                      </td>
                      <td className="py-2 px-4 border">
                        {new Date(exp.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border">
                        {exp?.dueDate || new Date(exp.createdAt).toLocaleString}
                      </td>
                      <td className="py-2 px-4 border flex gap-2 ">
                        {exp.status == "PENDING" ? (
                          <>
                            <button
                              onClick={() => ChangeStatus("REJECTED", exp._id)}
                              className="bg-red-700 text-white "
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => ChangeStatus("PAID", exp._id)}
                              className="bg-blue-700 text-white "
                            >
                              Paid
                            </button>
                          </>
                        ) : (
                          <button
                            style={{
                              cursor: "text",
                            }}
                            className={` text-white ${
                              exp.status == "REJECTED"
                                ? "bg-red-500"
                                : exp.status == "PAID"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {exp.status}
                          </button>
                        )}
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
