import { useState, useEffect } from "react";

const Policies = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.user?.Role;

  const [pdf, setPdf] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [policy, setpolicy] = useState("")


  // Fetch the latest uploaded PDF
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await fetch(
          "https://hrms-backend-9qzj.onrender.com/api/policy/get-policy"
        );
        if (!res.ok) throw new Error("Failed to fetch PDF");
        const data = await res.json();
        setPdf(data.pdf || "");
      } catch (error) {
        console.error("Failed to fetch PDF:", error);
      }
    };
    fetchPdf();
  }, []);

  // const handleFileChange = (e) => {
  //   setpolicy(e.target.files[0])

  //  }

  // Handle PDF upload for admin
  const handleFileUpload = async (e) => {
    setpolicy(e.target.files[0]);

    if (!policy || policy.type !== "application/pdf") {
      alert("Please upload a valid PDF file");
      return;
    }

    const formdata = new FormData();

    formdata.append("pdfUrl", policy);

    // console.log(formdata.pdfUrl)

    setLoading(true);
    setMessage("");

    console.log(authUser?.accessToken);
    try {
      const res = await fetch(
        "https://hrms-backend-9qzj.onrender.com/api/policy/add-policy",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authUser?.accessToken}`,
            // "Content-Type": "multipart/form-data",
          },
          body: formdata,
        }
      );
      // console.log(pdfUrl)
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to upload PDF. Backend returned 500."
        );
      }

      const data = await res.json();
      setPdf(data.pdf); // update preview immediately
      setMessage("PDF uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(`❌ Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Human Resource Policies
        </h1>

        {/* Status Indicator */}
        <div className="text-center mb-6">
          {pdf ? (
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
              📄 Policy PDF is available
            </span>
          ) : (
            <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-medium">
              ❌ No Policy PDF uploaded yet
            </span>
          )}
        </div>

        {/* Admin Upload */}
        {role === "ADMIN" && (
          <div className="flex flex-col items-center mb-6">
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition">
              {loading ? "Uploading..." : "Upload PDF"}
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {message && (
              <p className="mt-3 text-sm font-medium text-gray-600">{message}</p>
            )}
          </div>
        )}

        {/* PDF Preview */}
        {pdf ? (
          <div className="space-y-4">
            <div className="w-full h-[75vh] border rounded-xl overflow-hidden shadow">
              <iframe
                src={pdf}
                title="Policy PDF"
                width="100%"
                height="100%"
                className="rounded-lg"
              />
            </div>

            {/* Download Button */}
            <div className="flex justify-center">
              <a
                href={pdf}
                download="HR-Policies.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
              >
                Download PDF
              </a>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">
            Please contact HR/Admin to upload the latest policy document.
          </p>
        )}
      </div>
    </div>
  );
};

export default Policies;
