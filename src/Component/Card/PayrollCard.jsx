import React, { useState } from "react";
import axios from "axios";
import { Loader2, User, Mail, Briefcase, IndianRupee } from "lucide-react";

const PayrollCard = ({ employee }) => {
  const [otherDeductions, setOtherDeductions] = useState({
    leaveDays: 0,
    lateComming: 0,
    remarks: "",
  });

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false); // Track submission

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const token = authUser?.accessToken;

  // Safely calculate final salary
  const finalSalary = Math.max(
    (employee?.Salary || 0) -
      (Number(otherDeductions.leaveDays) || 0) * 500 -
      (Number(otherDeductions.lateComming) || 0) * 200,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOtherDeductions((prev) => ({
      ...prev,
      [name]: value !== "" ? value : 0, // ensure controlled
    }));
  };

  const handleSubmit = async () => {
    if (!month || !year) {
      setMessage("❌ Please select Month and Year");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        _id: employee?._id || "",
        grossSalary: finalSalary,
        month,
        year,
        otherDeductions,
        submittedAt: new Date().toISOString(),
      };

      await axios.post(`${import.meta.env.VITE_BASE_URL}/payment/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setMessage("✅ Payroll sent to Admin for approval!");
      setSubmitted(true); // mark as submitted

      // Reset form safely
      setOtherDeductions({ leaveDays: 0, lateComming: 0, remarks: "" });
      setMonth("");
      setYear("");
    } catch (error) {
      console.error("Error submitting payroll:", error);
      setMessage("❌ Failed to send payroll. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg border">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <img
          draggable={false}
          src={employee?.Profile_url || ""}
          className="w-14 h-14 rounded-full object-cover"
          alt="profile"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <User size={18} /> {employee?.FirstName} {employee?.LastName}
          </h2>
          <p className="text-gray-600 flex items-center gap-2 text-sm">
            <Mail size={16} /> {employee?.Email || "-"}
          </p>
          <p className="text-gray-700 flex items-center gap-2 text-sm mt-1">
            <Briefcase size={16} /> {employee?.Designation || "-"}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm text-gray-600">Base Salary</p>
          <p className="text-lg font-semibold text-blue-600 flex items-center gap-1">
            <IndianRupee size={16} /> {(employee?.Salary || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* API Message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${
            message.includes("✅")
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Form */}
      <div className="space-y-5">
        {/* Deductions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Days of Leave
            </label>
            <input
              type="number"
              name="leaveDays"
              value={otherDeductions.leaveDays}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring outline-none"
              min="0"
              disabled={submitted} // disable if already submitted
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Late Coming (days)
            </label>
            <input
              type="number"
              name="lateComming"
              value={otherDeductions.lateComming}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring outline-none"
              min="0"
              disabled={submitted} // disable if already submitted
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={otherDeductions.remarks}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring outline-none"
            placeholder="Add remarks..."
            disabled={submitted} // disable if already submitted
          />
        </div>

        {/* Month & Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <input
              type="month"
              value={month && year ? `${year}-${month}` : ""}
              onChange={(e) => {
                const [y, m] = e.target.value.split("-");
                setYear(y);
                setMonth(m);
              }}
              className="w-full border p-2 rounded-lg focus:ring outline-none"
              disabled={submitted} // disable if already submitted
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              min="2000"
              max={new Date().getFullYear()}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border p-2 rounded-lg focus:ring outline-none"
              disabled={submitted} // disable if already submitted
            />
          </div>
        </div>

        {/* Salary Summary */}
        <div className="bg-gray-50 border rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">Calculated Final Salary</p>
          <p className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1 mt-1">
            <IndianRupee size={20} /> {(finalSalary || 0).toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || submitted} // disable after submit
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition
            ${
              submitted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : null}
          {submitted
            ? "Sent to Admin for Approval"
            : loading
            ? "Submitting..."
            : "Send to Admin for Approval"}
        </button>
      </div>
    </div>
  );
};

export default PayrollCard;
