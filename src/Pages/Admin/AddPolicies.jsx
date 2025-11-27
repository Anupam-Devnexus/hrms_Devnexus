import React, { useState } from "react";

const AddPolicies = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser")) || {};
  const token = authUser.accessToken;

  const [policies, setPolicies] = useState([
    { heading: "", subPolicies: [{ subHeading: "", description: "" }] },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Handle heading change
  const handleHeadingChange = (policyIndex, value) => {
    const newPolicies = [...policies];
    newPolicies[policyIndex].heading = value;
    setPolicies(newPolicies);
  };

  // Handle subpolicy changes
  const handleSubPolicyChange = (policyIndex, subIndex, field, value) => {
    const newPolicies = [...policies];
    newPolicies[policyIndex].subPolicies[subIndex][field] = value;
    setPolicies(newPolicies);
  };

  // Add/remove subpolicies
  const addSubPolicy = (policyIndex) => {
    const newPolicies = [...policies];
    newPolicies[policyIndex].subPolicies.push({
      subHeading: "",
      description: "",
    });
    setPolicies(newPolicies);
  };

  const removeSubPolicy = (policyIndex, subIndex) => {
    const newPolicies = [...policies];
    newPolicies[policyIndex].subPolicies = newPolicies[
      policyIndex
    ].subPolicies.filter((_, i) => i !== subIndex);
    setPolicies(newPolicies);
  };

  // Add/remove policy groups
  const addPolicy = () => {
    setPolicies([
      ...policies,
      { heading: "", subPolicies: [{ subHeading: "", description: "" }] },
    ]);
  };

  const removePolicy = (policyIndex) => {
    setPolicies(policies.filter((_, i) => i !== policyIndex));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = { policies };

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/policy/add-policy`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      var resb  = await response.json();
      console.log("response", resb)
      console.log(payload)
      if (!response.ok) throw new Error("Failed to add policies");

      setMessage({ text: "Policies added successfully!", type: "success" });
      setPolicies([{ heading: "", subPolicies: [{ subHeading: "", description: "" }] }]);
    } catch (error) {
      console.error(error);
      setMessage({
        text: error.message || "Failed to add policies",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start min-h-screen bg-gray-100 p-6 gap-6">
      {/* Form */}
      <div className="w-full md:w-1/2 bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Add Policies from {authUser?.Role} {authUser?.FirstName}
        </h2>

        {message.text && (
          <div
            className={`p-3 rounded-lg text-white text-center ${message.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {policies.map((policy, pIndex) => (
            <div key={pIndex} className="border rounded-xl p-4 bg-gray-50 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-700">
                  Policy {pIndex + 1}
                </h3>
                {policies.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePolicy(pIndex)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Heading */}
              <input
                type="text"
                value={policy.heading}
                onChange={(e) => handleHeadingChange(pIndex, e.target.value)}
                placeholder="Enter Policy Heading"
                required
                className="w-full p-3 rounded-xl border border-gray-300"
              />

              {/* Sub Policies */}
              {policy.subPolicies.map((sub, sIndex) => (
                <div key={sIndex} className="border p-3 rounded-xl bg-white space-y-2">
                  <input
                    type="text"
                    value={sub.subHeading}
                    onChange={(e) =>
                      handleSubPolicyChange(pIndex, sIndex, "subHeading", e.target.value)
                    }
                    placeholder="Enter Sub-Policy Heading"
                    required
                    className="w-full p-2 rounded-lg border border-gray-300"
                  />
                  <textarea
                    value={sub.description}
                    onChange={(e) =>
                      handleSubPolicyChange(pIndex, sIndex, "description", e.target.value)
                    }
                    placeholder="Enter Sub-Policy Description"
                    required
                    className="w-full p-2 rounded-lg border border-gray-300"
                  />
                  {policy.subPolicies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubPolicy(pIndex, sIndex)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove Sub-Policy
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addSubPolicy(pIndex)}
                className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600"
              >
                + Add Sub-Policy
              </button>
            </div>
          ))}

          {/* Add another policy */}
          <button
            type="button"
            onClick={addPolicy}
            className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            + Add Another Policy
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 mt-4 rounded-xl font-semibold text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {loading ? "Submitting..." : "Submit All Policies"}
          </button>
        </form>
      </div>

      {/* Live Preview */}
      <div className="w-full md:w-1/2 bg-gray-50 shadow-inner rounded-2xl p-6 space-y-6">
        <h3 className="text-xl font-bold text-gray-700 border-b pb-2">Live Preview</h3>
        {policies.map((policy, pIndex) => (
          <div key={pIndex} className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {policy.heading || `Policy ${pIndex + 1}`}
            </h2>
            {policy.subPolicies.map((sub, sIndex) => (
              <div key={sIndex} className="ml-4 mt-2">
                <h4 className="font-semibold text-gray-700">
                  {pIndex + 1}.{sIndex + 1} {sub.subHeading || "Sub-Policy Heading"}
                </h4>
                <p className="text-gray-600 mt-1">
                  {sub.description || "Sub-Policy Description"}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddPolicies;
