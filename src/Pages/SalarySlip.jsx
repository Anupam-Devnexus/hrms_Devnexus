// src/Pages/SalarySlipForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileDown, Plus, Trash } from "lucide-react";
import { toast } from "react-toastify";

export default function SalarySlipForm() {
  const [form, setForm] = useState({
    employeeId: "",
    AadharCardNumber: "",
    PANCardNumber: "",
    month: "",
    paidDays: "",
    unPaidDays: "",
    specialAllowance: "",
    halfDay: "",
    perDayAmount: "",
    advanceRecovery: "",
    PF: "",
    payDate: "",
    basic: "",
    hra: undefined,
    tax: undefined,
    allowances: [],
    deductions: [],
  });

  const {
    user: { Role },
    accessToken,
  } = JSON.parse(localStorage.getItem("authUser"));

  const [employees, setEmployees] = useState([]);
  const [disable, setDisable] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const addAllowance = () =>
    setForm({
      ...form,
      allowances: [...form.allowances, { title: "", amount: "" }],
    });

  const addDeduction = () =>
    setForm({
      ...form,
      deductions: [...form.deductions, { title: "", amount: "" }],
    });

  const handleAllowanceChange = (i, field, value) => {
    const updated = [...form.allowances];
    updated[i][field] = value;
    setForm({ ...form, allowances: updated });
  };

  const handleDeductionChange = (i, field, value) => {
    const updated = [...form.deductions];
    updated[i][field] = value;
    setForm({ ...form, deductions: updated });
  };

  const removeAllowance = (i) => {
    const updated = form.allowances.filter((_, idx) => idx !== i);
    setForm({ ...form, allowances: updated });
  };

  const removeDeduction = (i) => {
    const updated = form.deductions.filter((_, idx) => idx !== i);
    setForm({ ...form, deductions: updated });
  };

  const generateSlip = async () => {
    setDisable(false);
    if (
      !form.employeeId ||
      !form.basic ||
      !form.month ||
      !form.AadharCardNumber ||
      !form.PANCardNumber
    ) {
      alert("All fields are required");
      setDisable(true);

      return;
    }

    console.log("form data", form);
    // return;

    try {
      const { data } = await axios.post(
        "https://hrms-backend-9qzj.onrender.com/api/generate",
        form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          // responseType: "arraybuffer",
        }
      );
      console.log("data", data);

      if (data.success) {
        toast.success(data.message);
        setForm({
          employeeId: "",
          AadharCardNumber: "",
          PANCardNumber: "",
          month: "",
          paidDays: "",
          unPaidDays: "",
          perDayAmount: "",
          specialAllowance: "",
          halfDay: "",
          advanceRecovery: "",
          PF: "",
          payDate: "",
          basic: "",
          hra: "",
          tax: "",
          allowances: [],
          deductions: [],
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
      // alert("Failed to generate payslip. Check backend or URL.");
    } finally {
      setDisable(true);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await axios.get(
          "https://hrms-backend-9qzj.onrender.com/api/user"
        );
        if (!data.success) throw new Error(data.message);
        setEmployees(data.Emps);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  const Loader = () => (
    <div className="w-5 ml-2  absolute inline-block aspect-square rounded-full border-2 animate-spin  border-dashed border-white "></div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
        💼 Generate Employee Salary Slip
      </h2>

      {/* Employee Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <select
          style={{
            cursor: disable ? "pointer" : "not-allowed",
          }}
          disabled={!disable}
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.FirstName}
            </option>
          ))}
        </select>

        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          type="text"
          name="AadharCardNumber"
          value={form.AadharCardNumber}
          // onChange={handleChange}
          maxLength={12}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e);
            }
          }}
          pattern="[0-9]"
          placeholder="Aadhar card number"
          className="border rounded-lg p-2"
        />

        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          id="panno"
          type="text"
          name="PANCardNumber"
          value={form.PANCardNumber}
          onChange={handleChange}
          placeholder="PAN card number"
          className="border rounded-lg p-2"
        />

        <div>
          <label htmlFor="mon">Month</label>

          <input
            style={{
              cursor: disable ? "text" : "not-allowed",
            }}
            id="mon"
            disabled={!disable}
            type="month"
            name="month"
            max={new Date().toISOString().slice(0, 7)}
            value={form.month}
            onChange={handleChange}
            placeholder="Select salary month"
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label htmlFor="paydate">Pay Date</label>
          <input
            id="paydate"
            style={{
              cursor: disable ? "text" : "not-allowed",
            }}
            disabled={!disable}
            type="date"
            name="payDate"
            max={new Date().toISOString().slice(0, 7)}
            value={form.payDate}
            onChange={handleChange}
            // placeholder="Select salary month"
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
      </div>

      {/* Salary Info */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          type="number"
          name="basic"
          value={form.basic}
          onChange={handleChange}
          placeholder="Basic Salary"
          className="border rounded-lg p-2"
        />
        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          type="number"
          name="hra"
          value={form.hra}
          onChange={handleChange}
          placeholder="HRA "
          className="border rounded-lg p-2"
        />
        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          type="text"
          name="specialAllowance"
          value={form.specialAllowance}
          // onChange={handleChange}
          maxLength={12}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e);
            }
          }}
          pattern="[0-9]"
          placeholder="special Allowance"
          className="border rounded-lg p-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          type="text"
          name="paidDays"
          value={form.paidDays}
          maxLength={2}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e);
            }
          }}
          pattern="[0-9]"
          max={31}
          min={1}
          placeholder="Paid days"
          className="border rounded-lg p-2"
        />
        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          type="text"
          name="unPaidDays"
          value={form.unPaidDays}
          // onChange={handleChange}
          maxLength={2}
          // max={}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e);
            }
          }}
          pattern="[0-9]"
          placeholder="Unpaid days"
          className="border rounded-lg p-2"
        />
        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          type="number"
          name="tax"
          value={form.tax}
          onChange={handleChange}
          placeholder="Tax "
          className="border rounded-lg p-2"
        />
        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          type="text"
          name="PF"
          value={form.PF}
          // onChange={handleChange}
          maxLength={12}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e);
            }
          }}
          pattern="[0-9]"
          placeholder="Provident Fund"
          className="border rounded-lg p-2"
        />
        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          type="text"
          name="advanceRecovery"
          value={form.advanceRecovery}
          // onChange={handleChange}
          maxLength={12}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e);
            }
          }}
          pattern="[0-9]"
          placeholder="Advance Recovery"
          className="border rounded-lg p-2"
        />
        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          type="text"
          name="halfDay"
          value={form.halfDay}
          // onChange={handleChange}
          maxLength={12}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e);
            }
          }}
          pattern="[0-9]"
          placeholder="Half days"
          className="border rounded-lg p-2"
        />
        <input
          style={{
            cursor: disable ? "text" : "not-allowed",
          }}
          disabled={!disable}
          type="text"
          name="perDayAmount"
          value={form.perDayAmount}
          // onChange={handleChange}
          maxLength={12}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e);
            }
          }}
          pattern="[0-9]"
          placeholder="Per day amount"
          className="border rounded-lg p-2"
        />
      </div>

      {/* Allowances */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-700">Allowances</h3>
          <button
            disabled={!disable}
            style={{
              cursor: disable ? "pointer" : "not-allowed",
            }}
            onClick={addAllowance}
            className="text-sm bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        {form.allowances.map((a, i) => (
          <div key={i} className="grid grid-cols-3 gap-3 mb-2">
            <input
              style={{
                cursor: disable ? "pointer" : "not-allowed",
              }}
              disabled={!disable}
              type="text"
              value={a.title}
              onChange={(e) =>
                handleAllowanceChange(i, "title", e.target.value)
              }
              placeholder="Allowance Title"
              className="border rounded-lg p-2"
            />
            <input
              style={{
                cursor: disable ? "text" : "not-allowed",
              }}
              disabled={!disable}
              type="number"
              value={a.amount}
              onChange={(e) =>
                handleAllowanceChange(i, "amount", +e.target.value)
              }
              placeholder="Amount"
              className="border rounded-lg p-2"
            />
            <button
              disabled={!disable}
              style={{
                cursor: disable ? "pointer" : "not-allowed",
              }}
              onClick={() => removeAllowance(i)}
              className="bg-red-500 text-white rounded-lg flex items-center justify-center"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Deductions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-700">Deductions</h3>
          <button
            disabled={!disable}
            style={{
              cursor: disable ? "pointer" : "not-allowed",
            }}
            onClick={addDeduction}
            className="text-sm bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        {form.deductions.map((d, i) => (
          <div key={i} className="grid grid-cols-3 gap-3 mb-2">
            <input
              style={{
                cursor: disable ? "text" : "not-allowed",
              }}
              disabled={!disable}
              type="text"
              value={d.title}
              onChange={(e) =>
                handleDeductionChange(i, "title", e.target.value)
              }
              placeholder="Deduction Title"
              className="border rounded-lg p-2"
            />
            <input
              style={{
                cursor: disable ? "text" : "not-allowed",
              }}
              disabled={!disable}
              type="number"
              value={d.amount}
              onChange={(e) =>
                handleDeductionChange(i, "amount", +e.target.value)
              }
              placeholder="Amount"
              className="border rounded-lg p-2"
            />
            <button
              onClick={() => removeDeduction(i)}
              disabled={!disable}
              style={{
                cursor: disable ? "pointer" : "not-allowed",
              }}
              className="bg-red-500 text-white rounded-lg flex items-center justify-center"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={generateSlip}
        disabled={!disable}
        style={{
          cursor: disable ? "pointer" : "not-allowed",
        }}
        className="w-full relative  bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
      >
        Generate Salary Slip PDF {!disable && <Loader />}
      </button>
    </div>
  );
}
