import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayrollCard from "../../Component/Card/PayrollCard";
import { useUserStore } from "../../Zustand/GetAllData";
import { User, IndianRupee, Calendar } from "lucide-react";

const Payroll = () => {
  const [paymentData, setPaymentData] = useState([]); // API data for ADMIN
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const { allData, fetchAllData, loading, error } = useUserStore();
  const navigate = useNavigate();

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const Role = authUser?.user?.Role;
  const token = authUser?.accessToken;

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch payment data if ADMIN
  useEffect(() => {
    if (Role === "ADMIN") {
      const fetchPayments = async () => {
        setLoadingPayments(true);
        try {
          const res = await fetch(
            "https://hrms-backend-9qzj.onrender.com/api/payment/",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const result = await res.json();
          // ✅ result is already an array
          setPaymentData(result.data);
          console.log("✅ Payment Data for ADMIN:", result.data);
        } catch (err) {
          console.error("❌ Error fetching payments:", err);
          setPaymentError(err.message);
        } finally {
          setLoadingPayments(false);
        }
      };

      fetchPayments();
    }
  }, [Role, token]);

  // Handle Confirm / Reject
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `https://hrms-backend-9qzj.onrender.com/api/payment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      // Update local state
      setPaymentData((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status } : p))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("❌ Failed to update status");
    }
  };

  // Normalize users (for non-admin view)
  const users =
    allData?.data && Array.isArray(allData.data)
      ? allData.data
      : allData?.data
      ? Object.values(allData.data).flat()
      : [];

  const counts = {
    ADMIN: users.filter((u) => u.Role?.toUpperCase() === "ADMIN").length,
    TL: users.filter((u) => u.Role?.toUpperCase() === "TL").length,
    HR: users.filter((u) => u.Role?.toUpperCase() === "HR").length,
    EMPLOYEE: users.filter(
      (u) => !["ADMIN", "TL", "HR"].includes(u.Role?.toUpperCase() || "")
    ).length,
  };

  if (loading || loadingPayments)
    return <p className="text-center text-blue-500 mt-10">Loading...</p>;
  if (error || paymentError)
    return (
      <p className="text-center text-red-500 mt-10">{error || paymentError}</p>
    );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Payroll Page</h1>
        <button
          onClick={() => navigate("/dashboard/history")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          History
        </button>
      </div>

      {/* If ADMIN → show payment approval cards */}
      {Role === "ADMIN" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {paymentData?.data?.length > 0 ? (
            paymentData?.data?.map((p) => (
              <div
                key={p._id}
                className="bg-white border rounded-2xl shadow-md p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3 border-b pb-3">
                  <User size={20} className="text-blue-600" />
                  <div>
                    <h2 className="font-semibold text-lg">
                      {p.employee?.FirstName} {p.employee?.LastName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {p.employee?.Email || "-"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {p.employee?.Department || "-"}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-500">Gross Salary</p>
                    <p className="font-bold text-green-600 flex items-center gap-1">
                      <IndianRupee size={14} />
                      {p.grossSalary?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="text-sm space-y-1">
                  <p>
                    <Calendar size={14} className="inline text-gray-500 mr-1" />
                    {p.month}/{p.year}
                  </p>
                  <p>
                    Deductions: Leave {p.otherDeductions?.leaveDays || 0}, Late{" "}
                    {p.otherDeductions?.lateComming || 0}
                  </p>
                  <p>Remarks: {p.otherDeductions?.remarks || "—"}</p>
                  <p>
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        p.status === "Confirmed"
                          ? "text-green-600"
                          : p.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => updateStatus(p._id, "Confirmed")}
                    disabled={p.status === "Confirmed"}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(p._id, "Rejected")}
                    disabled={p.status === "Rejected"}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No payment requests found.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Non-admin view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
            {Object.entries(counts).map(([role, count]) => (
              <div
                key={role}
                className="bg-blue-100 p-4 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-gray-700">{role}</h3>
                <p className="text-2xl font-bold text-blue-600">{count}</p>
              </div>
            ))}
          </div>

          {users.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {users.map((user) => (
                <PayrollCard key={user._id} employee={user} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No employees found.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Payroll;
