import React, { useState } from "react";
import axios from "axios";

export default function PayrollManager() {
  const [activeForm, setActiveForm] = useState("salary");

  // Common salary form state
  const [salaryForm, setSalaryForm] = useState({
    employeeId: "",
    basicSalary: "",
    hra: "",
    da: "",
    conveyanceAllowance: "",
    medicalAllowance: "",
    otherAllowances: "",
    pf: "",
    esi: "",
    tds: "",
    otherDeductions: "",
    month: "",
    year: new Date().getFullYear(),
    paymentDate: "",
    status: "Pending",
  });

  // Toggle between forms
  const handleToggle = (form) => {
    console.log("Switching form to:", form);
    setActiveForm(form);
  };

  // Generic submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Before Posting Data:", salaryForm);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/salary`,
        salaryForm
      );
      console.log("✅ API Response:", res.data);
    } catch (err) {
      console.error("❌ API Error:", err.response?.data || err.message);
    }
  };

  // Form renderer
  const renderForm = () => {
    switch (activeForm) {
      case "salary":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Employee ID"
              value={salaryForm.employeeId}
              onChange={(e) => setSalaryForm({ ...salaryForm, employeeId: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Basic Salary"
              value={salaryForm.basicSalary}
              onChange={(e) => setSalaryForm({ ...salaryForm, basicSalary: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="HRA" value={salaryForm.hra} onChange={(e) => setSalaryForm({ ...salaryForm, hra: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="DA" value={salaryForm.da} onChange={(e) => setSalaryForm({ ...salaryForm, da: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="Conveyance" value={salaryForm.conveyanceAllowance} onChange={(e) => setSalaryForm({ ...salaryForm, conveyanceAllowance: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="Medical" value={salaryForm.medicalAllowance} onChange={(e) => setSalaryForm({ ...salaryForm, medicalAllowance: e.target.value })} className="border p-2 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="PF" value={salaryForm.pf} onChange={(e) => setSalaryForm({ ...salaryForm, pf: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="ESI" value={salaryForm.esi} onChange={(e) => setSalaryForm({ ...salaryForm, esi: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="TDS" value={salaryForm.tds} onChange={(e) => setSalaryForm({ ...salaryForm, tds: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="Other Deductions" value={salaryForm.otherDeductions} onChange={(e) => setSalaryForm({ ...salaryForm, otherDeductions: e.target.value })} className="border p-2 rounded" />
            </div>

            <input
              type="text"
              placeholder="Month"
              value={salaryForm.month}
              onChange={(e) => setSalaryForm({ ...salaryForm, month: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <input
              type="date"
              value={salaryForm.paymentDate}
              onChange={(e) => setSalaryForm({ ...salaryForm, paymentDate: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <select
              value={salaryForm.status}
              onChange={(e) => setSalaryForm({ ...salaryForm, status: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Processed">Processed</option>
              <option value="Paid">Paid</option>
            </select>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded shadow">
              Save Salary
            </button>
          </form>
        );

      case "deductions":
        return (
          <div className="p-4 text-gray-700">
            <p className="text-lg font-semibold">Deductions Form (coming soon)</p>
          </div>
        );

      case "employee":
        return (
          <div className="p-4 text-gray-700">
            <p className="text-lg font-semibold">Employee Form (coming soon)</p>
          </div>
        );

      default:
        return <p>Select a form to view</p>;
    }
  };

  return (
    <div className="p-2 max-w-5xl mx-auto  rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Payroll Manager</h2>

      {/* Toggle Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleToggle("salary")}
          className={`px-4 py-2 rounded-lg ${activeForm === "salary" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Salary
        </button>
        <button
          onClick={() => handleToggle("deductions")}
          className={`px-4 py-2 rounded-lg ${activeForm === "deductions" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Deductions
        </button>
        <button
          onClick={() => handleToggle("employee")}
          className={`px-4 py-2 rounded-lg ${activeForm === "employee" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Employee
        </button>
      </div>

      {/* Render Selected Form */}
      {renderForm()}
    </div>
  );
}
