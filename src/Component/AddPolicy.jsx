import { useState } from "react";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { toast } from "react-toastify";
import axios from "axios";

const token = localStorage.getItem("hrmsAuthToken");

export default function AddPolicy({ onSuccess, mode, existingPolicy }) {
  const [content, setContent] = useState(existingPolicy?.policies || "");
  const [isPending, setIsPending] = useState(false);

  // setContent(existingPolicy?.policies || "");

  const handleSubmit = async () => {
    setIsPending(true);

    try {
      if (mode === "create") {
        var { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/policy/add-policy`,
          { policy: content },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        var { data } = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/policy/update-policy`,
          { policy: content, id: existingPolicy._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log(data);

      if (data.success) {
        onSuccess(data.policy);
        toast.success(data.message || "Policy added successfully");
      }
      setContent("");
    } catch (error) {
      console.error("Error adding policy:", error);
      toast.error(error?.response?.data.message || "Error adding policy");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      {/* Editor */}
      <Editor
        value={content}
        onTextChange={(e) => setContent(e.htmlValue)}
        style={{ height: "70svh", width: "70vw" }}
        disabled={isPending}
      />

      <button
        onClick={handleSubmit}
        disabled={isPending || !content}
        style={{
          cursor: isPending || !content ? "not-allowed" : "pointer",
        }}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition mt-4"
      >
        {isPending ? "Adding..." : "Add Policy"}
      </button>
    </div>
  );
}
