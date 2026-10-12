import { useState, useEffect } from "react";
import axios from "axios";

const AssignOfficerModal = ({ isOpen, onClose, complaintId, onAssign, position }) => {
  const [officers, setOfficers] = useState([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOfficers = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/officer/all-officers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOfficers(res.data.officers || []);
      } catch (err) {
        console.error("Failed to fetch officers", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) fetchOfficers();
  }, [isOpen]);


  const handleAssign = () => {
  if (selectedOfficerId) {
    console.log("Assigning officer:", selectedOfficerId, "to complaint:", complaintId);
    onAssign(complaintId, selectedOfficerId);
  } else {
    alert("Please select an officer.");
  }
};

  if (!isOpen) return null;

  return (
    <>
      <div
        className="absolute z-50"
        style={{ top: position.top, left: position.left }}
      >
        <div className="w-[220px] p-3 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 shadow-xl">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Assign Officer</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span className="ml-2 text-xs text-blue-700">Loading officers...</span>
            </div>
          ) : (
          <select
            value={selectedOfficerId}
            onChange={(e) => setSelectedOfficerId(e.target.value)}
            className="w-full mb-3 bg-white/50 backdrop-blur-sm border border-gray-300 p-1.5 rounded-md text-xs text-gray-700 shadow-sm"
          >
            <option value="">-- Select Officer --</option>
            {officers.map((officer) => (
              <option key={officer._id} value={officer._id}>
                {officer.fullName}
              </option>
            ))}
          </select>
          )}
          <div className="flex justify-end gap-2 text-xs">
            <button
              className="px-2 py-1 bg-white/70 text-gray-700 rounded hover:bg-white/90 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={handleAssign}
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </>

  );
};

export default AssignOfficerModal;
