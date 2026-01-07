import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AddPolicy from "../Component/AddPolicy";
import { useAttendance } from "../Zustand/PersonalAttendance";

const Policies = () => {
  const { user } = useAttendance();

  const role = user?.Role;
  const isAdmin = role === "ADMIN";

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // for admin edit mode

  // ===================== FETCH POLICY =====================
  const token = localStorage.getItem("hrmsAuthToken");
  useEffect(() => {
    const fetchPolicy = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/policy/get-policy`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(data);

        if (data.success) {
          setPolicy(data.policy);
          console.log(data.policy);
        } else {
          setPolicy(null);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
          error.message ||
          "Policy failed to load"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  // ===================== DELETE POLICY (ADMIN ONLY) =====================
  const handleDeletePolicy = async () => {
    if (!isAdmin) {
      toast.error("Only admin can delete the policy");
      return;
    }

    if (!policy?._id) {
      toast.error("Policy id not found");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this policy?")) return;

    setLoading(true);

    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/policy/delete-policy/${policy._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Policy deleted");
        setPolicy(null);
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to delete policy");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to delete policy"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePolicySaved = (savedPolicy) => {
    // called from AddPolicy when create/edit API is successful
    setPolicy(savedPolicy);
    setIsEditing(false);
  };

  return (
    <div className="min-h-full   p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-0 text-center">
        Human Resource Policies
      </h1>

      {/* LOADING STATE */}
      {loading && !policy && (
        <p className="text-gray-500 text-center mt-4">Loading...</p>
      )}

      {/* ========== CASE 1: POLICY EXISTS (EVERYONE CAN VIEW) ========== */}
      {policy && !isEditing && (
        <div className="space-y-4 w-full max-w-6xl">
          <div
            className="w-full h-[85vh] bg-white rounded-xl overflow-auto shadow p-4"
            dangerouslySetInnerHTML={{
              __html: policy.policies,
            }}
          ></div>

          {/* ADMIN CONTROLS WHEN POLICY EXISTS */}
          {isAdmin && (
            <div className="flex gap-4 mt-4">
              <button
                disabled={loading}
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-60"
              >
                Edit Policy
              </button>
              <button
                disabled={loading}
                onClick={handleDeletePolicy}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Delete Policy"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========== CASE 2: ADMIN EDITING EXISTING POLICY ========== */}
      {policy && isAdmin && isEditing && (
        <div className="flex flex-col items-center">
          <AddPolicy
            mode="edit"
            existingPolicy={policy}
            onSuccess={handlePolicySaved}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}

      {/* ========== CASE 3: NO POLICY YET ========== */}
      {!policy && !loading && (
        <div className="w-full max-w-4xl mt-6 text-center">
          {/* Non-admin users see only message */}
          {!isAdmin && (
            <p className="text-gray-500">
              No policy has been uploaded yet. Please contact HR/Admin to upload
              the latest policy document.
            </p>
          )}

          {/* Admin sees editor to create policy */}
          {isAdmin && (
            <div className="flex flex-col items-center">
              <p className="text-gray-600 mb-3">
                No policy found. Use the editor below to add one.
              </p>
              <AddPolicy mode="create" onSuccess={handlePolicySaved} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Policies;
