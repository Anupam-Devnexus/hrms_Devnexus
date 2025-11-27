import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Policies = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.user?.Role;

  const [pdf, setPdf] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // const [policy, setpolicy] = useState("");

  // Fetch the latest uploaded PDF
  useEffect(() => {
    setLoading(true);
    const fetchPdf = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/policy/get-policy`
        );
        // if (!res.ok) throw new Error("Failed to fetch PDF");
        console.log(data);
        setPdf(data.policy);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPdf();
  }, []);

  const handleFileDelete = async () => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/policy/delete-policy/${pdf._id}`,
        {
          headers: {
            Authorization: `Bearer ${authUser.accessToken}`,
          },
        }
      );

      if (data.success) {
        toast.success("Policy Deleted");
        setPdf("");
        setMessage("Policy Deleted");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF upload for admin
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file");
      return;
    }

    const formdata = new FormData();

    formdata.append("pdfUrl", file);

    // setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/policy/add-policy`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authUser?.accessToken}`,
            // "Content-Type": "multipart/form-data",
          },
          body: formdata,
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to upload PDF. Backend returned 500."
        );
      }

      const data = await res.json();
      console.log(data);
      toast.success("File Uploaded");
      setPdf(data.policy); // update preview immediately
      setMessage("PDF uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(`❌ Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-100 p-6 flex flex-col items-center">
      {/* <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl"> */}
      {/* Header */}
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Human Resource Policies
        </h1> */}

      {/* Status Indicator */}
      {/* <div className="text-center mb-6">
          {pdf ? (
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
              📄 Policy PDF is available
            </span>
          ) : (
            <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-medium">
              ❌ No Policy PDF uploaded yet
            </span>
          )}
        </div> */}

      {/* Admin Upload */}
      {role === "ADMIN" && !pdf ? (
        <div className="flex flex-col items-center mb-6">
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition">
            {loading ? "Uploading..." : "Upload PDF"}
            <input
              type="file"
              disabled={loading}
              style={{
                cursor: loading && "not-allowed",
              }}
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {message && (
            <p className="mt-3 text-sm font-medium text-gray-600">{message}</p>
          )}
        </div>
      ) : (
        role == "ADMIN" && (
          <div className="my-4">
            <button
              disabled={loading}
              style={{
                cursor: loading && "not-allowed",
              }}
              onClick={handleFileDelete}
              className="bg-red-600   hover:bg-red-700 text-white px-6 py-2 rounded-lg cursor-pointer transition"
            >
              {loading ? "Deleting..." : "Delete Policy"}
            </button>
          </div>
        )
      )}

      {/* PDF Preview */}
      {pdf ? (
        <div className="space-y-4 w-full max-w-4xl">
          <div className="w-full h-[90vh]  rounded-xl overflow-hidden shadow">
            <iframe
              src={pdf.secure_url}
              title="Devnexus solutions Pvt. Ltd. Policy PDF"
              width="100%"
              height="100%"
              className="rounded-lg"
            />
          </div>

          {/* Download Button */}
        </div>
      ) : loading ? (
        <p className="text-gray-500 text-center mt-10">Loading...</p>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          Please contact HR/Admin to upload the latest policy document.
        </p>
      )}
      {/* </div> */}
    </div>
  );
};

export default Policies;
