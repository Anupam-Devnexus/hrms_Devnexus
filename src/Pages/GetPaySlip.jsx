import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileDown, Search } from "lucide-react";
import { toast } from "react-toastify";

const GetPaySlip = () => {
  const [month, setMonth] = useState("");
  const [allSlips, setAllSlips] = useState([]); // store all records
  const [filteredSlips, setFilteredSlips] = useState([]); // filtered view
  const [loading, setLoading] = useState(false);

  const [disable, setDisable] = useState(false);

  const {
    user: { _id },
    accessToken,
  } = JSON.parse(localStorage.getItem("authUser"));

  //  Fetch all payslips on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4343/api/getAllSlips",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("data", data);
        if (data.success) {
          setAllSlips(data.payslip);
          setFilteredSlips(data.payslip);
          console.log("allslip", allSlips);
        } else {
          toast.error("Failed to load payslips");
        }
      } catch (error) {
        // toast.error(
        //   error?.response?.data?.message || "Failed to fetch payslips"
        // );
      }
    })();

    console.log("allslip", allSlips);
  }, []);

  //  Filter slips by selected month
  const handleSearch = () => {
    if (!month) {
      setFilteredSlips(allSlips);
      toast.info("Showing all payslips");
      return;
    }

    const filtered = allSlips.filter((slip) => slip.month === month);

    console.log("filtered", filtered);

    if (filtered.length === 0) {
      toast.error("No payslip found for selected month");
    }

    setFilteredSlips(filtered);
  };

  //  Download PDF by URL
  const handleDownload = (url, month) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Payslip_${month}.pdf`);
    link.setAttribute("target", `_blank`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
        💼 Search Your Salary Slip
      </h2>

      <div className="w-full flex gap-2 items-center">
        <input
          type="month"
          name="month"
          max={new Date().toISOString().slice(0, 7)}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
          className="border border-gray-300 rounded-lg p-2 flex-1"
        />

        <button
          onClick={handleSearch}
          className={`flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <Search size={18} />
          Search
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Payslip Records
        </h2>

        {filteredSlips.length === 0 ? (
          <p className="text-gray-500 text-sm mt-3">No payslips found.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3 text-left text-sm font-medium text-gray-700">
                    Month
                  </th>

                  <th className="border p-3 text-center text-sm font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSlips.map((slip, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-3 text-sm text-gray-700">
                      {slip.month}
                    </td>

                    <td className="border p-3 text-center">
                      <button
                        onClick={() =>
                          handleDownload(slip.secure_url, slip.month)
                        }
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition"
                      >
                        <FileDown size={16} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetPaySlip;
