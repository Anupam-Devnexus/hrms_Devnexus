import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSalesStore } from "../../Zustand/GetSales";

const Sales = () => {
  const { salesList, error, loading, fetchSales } = useSalesStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const authUser = JSON.parse(localStorage.getItem("authUser"))?.user;
  const actual_Data = salesList?.sales || [];

  // Role-based filtering
  let visibleSales = actual_Data;
  if (authUser?.Role === "SALES") {
    visibleSales = actual_Data.filter(
      (item) => item.employee?.Email === authUser?.Email
    );
  }
  // TL & ADMIN → see all sales

  // Card Renderer per Role
  const renderCard = (item) => {
    if (authUser?.Role === "SALES") {
      return (
        <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-900">{item.heading}</h2>
          <p className="text-gray-600 italic">{item.subHeading}</p>
          <p className="mt-3 text-gray-700 text-sm">{item.description}</p>

          <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-blue-600 font-medium">{item.type}</span>
            <span className="text-yellow-600">{item.budget}</span>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Created on {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      );
    }

    if (authUser?.Role === "TL") {
      return (
        <div className="p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-md border hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-900">{item.heading}</h2>
          <p className="text-gray-600">{item.subHeading}</p>

          <p className="mt-2 text-sm text-gray-700">{item.description}</p>

          <div className="mt-4 flex flex-col gap-1 text-sm">
            <span className="text-blue-700 font-medium">{item.type}</span>
            <span className="text-yellow-700">Budget: {item.budget}</span>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border text-sm">
            <p className="font-medium text-gray-800">
              Employee: {item.employee?.FirstName} {item.employee?.LastName}
            </p>
            <p className="text-gray-600">{item.employee?.Email}</p>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Created on {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      );
    }

    if (authUser?.Role === "ADMIN") {
      return (
        <div className="p-5 bg-gradient-to-r from-purple-50 to-white rounded-xl shadow-md border hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-900">{item.heading}</h2>
          <p className="text-gray-600">{item.subHeading}</p>

          <p className="mt-3 text-sm text-gray-700">{item.description}</p>

          <div className="mt-3 flex flex-col gap-1 text-sm">
            <span className="text-blue-800 font-semibold">Type: {item.type}</span>
            <span className="text-yellow-700">Budget: {item.budget}</span>
          </div>

          <div className="mt-4 p-3 bg-purple-50 rounded-lg border text-sm">
            <p className="font-medium text-gray-800">
              {item.employee?.FirstName} {item.employee?.LastName}
            </p>
            <p className="text-gray-600">{item.employee?.Email}</p>
          </div>

          <div className="mt-3 text-xs text-gray-500 space-y-1">
            <p>Created: {new Date(item.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(item.updatedAt).toLocaleString()}</p>
            <p>Docs Attached: {item.docs?.length || 0}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Sales Portal ({visibleSales?.length || 0})
        </h1>

        {/* TL & ADMIN can Add Sales */}
        {(authUser?.Role === "TL" || authUser?.Role === "ADMIN") && (
          <button
            onClick={() => navigate("/dashboard/sales-updates")}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition rounded-lg shadow"
          >
            ➕ Add Sales
          </button>
        )}
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-gray-500">Loading sales...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Sales Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleSales.length > 0 ? (
          visibleSales.map((item) => (
            <div key={item._id}>{renderCard(item)}</div>
          ))
        ) : (
          <p className="text-gray-500">No sales data found.</p>
        )}
      </div>
    </div>
  );
};

export default Sales;
