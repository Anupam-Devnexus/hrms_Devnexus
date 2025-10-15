import React, { useState, useRef } from "react";

const AddSales = () => {
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [files, setFiles] = useState([]);
  const [fileProgress, setFileProgress] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = JSON.parse(localStorage.getItem("authUser"))?.accessToken;
  const fileInputRef = useRef(null);
// console.log(token)
  // Handle files (drag-and-drop or file input)
  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileChange = (e) => handleFiles(e.target.files);
  const handleDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };
  const handleDragOver = (e) => e.preventDefault();

  // Show confirmation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!heading || !description || !type || !budget) {
      alert("Please fill all required fields");
      return;
    }
    setShowConfirm(true);
  };

  // Submit to API with progress
  const confirmSubmit = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("subHeading", subHeading);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("budget", budget);
    files.forEach((file) => formData.append("docs", file));

    try {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        "https://hrms-backend-9qzj.onrender.com/api/sales/",
        true
      );
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progressPercent = Math.round((event.loaded / event.total) * 100);
          setFileProgress({ total: progressPercent });
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          alert("✅ Sales data added successfully!");
          setHeading(""); setSubHeading(""); setDescription(""); setType(""); setBudget("");
          setFiles([]); setFileProgress({});
          setShowConfirm(false);
        } else {
          alert("❌ Failed to add sales data.");
        }
        setSubmitting(false);
      };

      xhr.onerror = () => {
        alert("⚠️ Error uploading files.");
        setSubmitting(false);
      };

      xhr.send(formData);
    } catch (err) {
      console.error(err);
      alert("⚠️ Error adding sales data.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">➕ Add Sales Data</h2>
        <button onClick={()=>window.history.back()}
          className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2"
          >Back</button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Fields */}
          {["Heading","SubHeading","Description","Type","Budget"].map((field, idx) => {
            const valueMap = {Heading: heading, SubHeading: subHeading, Description: description, Type: type, Budget: budget};
            const setterMap = {Heading: setHeading, SubHeading: setSubHeading, Description: setDescription, Type: setType, Budget: setBudget};
            return (
              <div key={idx}>
                <label className="block font-medium text-gray-700 mb-1">{field}{field!=="SubHeading" && <span className="text-red-500">*</span>}</label>
                {field==="Description" ? (
                  <textarea rows="4" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={valueMap[field]} onChange={e => setterMap[field](e.target.value)} required />
                ) : (
                  <input type={field==="Budget"?"number":"text"} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={valueMap[field]} onChange={e => setterMap[field](e.target.value)} required={field!=="SubHeading"} placeholder={`Enter ${field}`} />
                )}
              </div>
            )
          })}

          {/* Drag & Drop Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Upload Files (Images, PDFs, Docs)</label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-400 p-8 rounded-lg cursor-pointer hover:bg-indigo-50 transition"
            >
              <p className="text-gray-500 text-center">
                Drag & drop files here or click to upload
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {files.map((file, idx) => (
                <div key={idx} className="flex flex-col  items-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-2 py-1 text-xs ">
                  {file.type.startsWith("image/") ? (
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <span className="truncate">{file.name}</span>
                  )}
                  {fileProgress.total && (
                    <div className="w-full bg-gray-300 rounded-full h-1 mt-1">
                      <div className="bg-indigo-600 h-1 rounded-full" style={{width: `${fileProgress.total}%`}}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={submitting} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
            Review & Submit
          </button>
        </form>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Confirm Sales Data</h3>
              <p className="mb-2"><strong>Heading:</strong> {heading}</p>
              {subHeading && <p className="mb-2"><strong>SubHeading:</strong> {subHeading}</p>}
              <p className="mb-2"><strong>Description:</strong> {description}</p>
              <p className="mb-2"><strong>Type:</strong> {type}</p>
              <p className="mb-2"><strong>Budget:</strong> {budget}</p>
              {files.length > 0 && <div className="flex flex-wrap gap-2 mb-4">{files.map((f,i)=><span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">{f.name}</span>)}</div>}
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={()=>setShowConfirm(false)} disabled={submitting} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                <button onClick={confirmSubmit} disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">{submitting?"Submitting...":"Confirm & Submit"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSales;
