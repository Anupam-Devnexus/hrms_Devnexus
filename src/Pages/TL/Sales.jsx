import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSalesStore } from "../../Zustand/GetSales";

const Sales = () => {
  const { salesList, error, loading, fetchSales } = useSalesStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const authUser = JSON.parse(localStorage.getItem("authUser"))?.user;
  const rawSales = salesList?.sales || [];

  const visibleSales = useMemo(() => {
    let data = rawSales;

    if (authUser?.Role === "SALES") {
      data = data.filter((item) => item.employee?.Email === authUser?.Email);
    }

    // sort newest first
    return [...data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [rawSales, authUser]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600 text-sm text-center">Loading sales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 text-sm text-center">Error: {error}</p>
      </div>
    );
  }

  const renderDocs = (docs) => {
    const safeDocs = Array.isArray(docs) ? docs : [];
    if (safeDocs.length === 0) {
      return <p className="text-xs text-gray-400">No documents attached.</p>;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {safeDocs.map((doc, index) => (
          <a
            key={doc.public_id || doc.secure_url || index}
            className="inline-flex items-center text-xs text-blue-700 underline break-all"
            target="_blank"
            rel="noreferrer"
            href={doc.secure_url}
          >
            {doc.public_id || `Document ${index + 1}`}
          </a>
        ))}
      </div>
    );
  };

  const renderCard = (item) => {
    const createdAt = item.createdAt ? new Date(item.createdAt) : null;
    const updatedAt = item.updatedAt ? new Date(item.updatedAt) : null;

    const isSalesOrTl =
      authUser?.Department === "SALES" || authUser?.Role === "TL";
    const isAdmin = authUser?.Role === "ADMIN";

    // Shared base card
    const BaseCard = ({ children, highlight }) => (
      <article
        className={`p-5 rounded-xl shadow-sm hover:shadow-md transition border ${
          highlight
            ? "bg-gradient-to-r from-purple-50 to-white border-purple-100"
            : "bg-white border-gray-200"
        } flex flex-col h-full overflow-hidden`}
      >
        {children}
      </article>
    );

    if (isSalesOrTl) {
      return (
        <BaseCard>
          <div className="space-y-2 flex-1 min-w-0">
            <h2
              className="text-lg font-semibold text-gray-900 truncate"
              title={item.heading}
            >
              {item.heading}
            </h2>

            {item.subHeading && (
              <p
                className="text-gray-600 italic text-sm truncate"
                title={item.subHeading}
              >
                {item.subHeading}
              </p>
            )}

            {item.description && (
              <p
                className="mt-2 text-gray-700 text-sm break-words max-h-24 overflow-y-auto pr-1"
                title={item.description}
              >
                {item.description}
              </p>
            )}

            <div className="mt-3 flex justify-between items-center text-xs sm:text-sm">
              <span className="text-blue-700 font-medium truncate max-w-[50%]">
                {item.type}
              </span>
              <span className="text-yellow-700 font-medium truncate max-w-[45%] text-right">
                {item.budget}
              </span>
            </div>

            {createdAt && (
              <p className="mt-2 text-xs text-gray-500">
                Created on {createdAt.toLocaleDateString()}
              </p>
            )}

            <div className="mt-3 border-t pt-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Documents
              </p>
              {renderDocs(item.docs)}
            </div>
          </div>
        </BaseCard>
      );
    }

    if (isAdmin) {
      return (
        <BaseCard highlight>
          <div className="space-y-2 flex-1 min-w-0">
            <h2
              className="text-lg font-semibold text-gray-900 truncate"
              title={item.heading}
            >
              {item.heading}
            </h2>

            {item.subHeading && (
              <p
                className="text-gray-600 text-sm truncate"
                title={item.subHeading}
              >
                {item.subHeading}
              </p>
            )}

            {item.description && (
              <p
                className="mt-2 text-sm text-gray-700 break-words max-h-24 overflow-y-auto pr-1"
                title={item.description}
              >
                {item.description}
              </p>
            )}

            <div className="mt-3 flex flex-col gap-1 text-xs sm:text-sm">
              <span className="text-blue-800 font-semibold truncate">
                Type: {item.type}
              </span>
              <span className="text-yellow-700 truncate">
                Budget: {item.budget}
              </span>
            </div>

            <div className="mt-4 p-3 bg-purple-50 rounded-lg border text-xs sm:text-sm">
              <p className="font-medium text-gray-800 truncate">
                {item.employee?.FirstName} {item.employee?.LastName}
              </p>
              {item.employee?.Email && (
                <p className="text-gray-600 text-xs break-all">
                  {item.employee.Email}
                </p>
              )}
            </div>

            <div className="mt-3 text-[11px] text-gray-500 space-y-1">
              {createdAt && <p>Created: {createdAt.toLocaleString()}</p>}
              {updatedAt && <p>Updated: {updatedAt.toLocaleString()}</p>}
              <p>Documents attached: {item.docs?.length || 0}</p>
            </div>

            <div className="mt-3 border-t pt-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Documents
              </p>
              {renderDocs(item.docs)}
            </div>
          </div>
        </BaseCard>
      );
    }

    // Fallback for other roles if any
    return (
      <BaseCard>
        <div className="space-y-2 flex-1 min-w-0">
          <h2
            className="text-lg font-semibold text-gray-900 truncate"
            title={item.heading}
          >
            {item.heading}
          </h2>
          {item.description && (
            <p
              className="mt-2 text-sm text-gray-700 break-words max-h-24 overflow-y-auto"
              title={item.description}
            >
              {item.description}
            </p>
          )}
          {renderDocs(item.docs)}
        </div>
      </BaseCard>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Sales Portal ({visibleSales.length})
          </h1>
          <p className="text-sm text-gray-500">
            View and manage sales records based on your role.
          </p>
        </div>

        {(authUser?.Role === "TL" || authUser?.Role === "ADMIN") && (
          <button
            onClick={() => navigate("/dashboard/add")}
            className="px-4 py-2 text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-700 transition rounded-lg shadow"
          >
            Add Sales
          </button>
        )}
      </div>

      {visibleSales.length === 0 ? (
        <div className="mt-8">
          <p className="text-gray-500 text-sm text-center">
            No sales data found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleSales.map((item) => (
            <div key={item._id}>{renderCard(item)}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sales;
