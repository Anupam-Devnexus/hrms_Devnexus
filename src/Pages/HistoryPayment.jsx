import React, { useEffect } from "react";
import { useHistory } from "../Zustand/GetPaymentHistory";
import { useNavigate } from "react-router-dom";

const HistoryPayment = () => {
  const { loading, error, historyList, fetchHistory } = useHistory();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  console.log(historyList);

  if (loading) return <div className="p-4 text-center">Loading history...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  // Filter the payments for only "Confirmed" or "Rejected" status
  const filteredHistory = historyList?.filter(
    (item) => item.status === "Paid" || item.status === "Rejected"
  );

  if (!filteredHistory || filteredHistory.length === 0)
    return <div className="p-4 text-center">No confirmed or rejected payment history found.</div>;

  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHistory.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                {item.employee.FirstName} {item.employee.LastName}
              </h2>
              <span
                className={`px-2 py-1 text-sm rounded ${
                  item.status === "Confirmed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              <p>
                <strong>Department:</strong> {item.employee.Department}
              </p>
              <p>
                <strong>Role:</strong> {item.employee.Role}
              </p>
              <p>
                <strong>Email:</strong> {item.employee.Email}
              </p>
            </div>

            <div className="text-sm text-gray-800 mb-2">
              <p>
                <strong>Month/Year:</strong> {item.month} {item.year}
              </p>
              <p>
                <strong>Gross Salary:</strong> ₹{item.grossSalary}
              </p>
              <p>
                <strong>Other Deductions:</strong> ₹{item.otherDeductions}
              </p>
              <p>
                <strong>Payment Date:</strong>{" "}
                {item.paymentDate
                  ? new Date(item.paymentDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="text-sm text-gray-700">
              <strong>Remarks:</strong> {item.remarks || "N/A"}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default HistoryPayment;
