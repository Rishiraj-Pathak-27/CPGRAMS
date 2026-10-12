import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  FileText,
  User,
  Phone,
  UserCircle,
  Calendar,
  MapPin,
  Download,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Send,
  X,
  Mail,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// Default color functions
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "in progress":
      return "bg-blue-100 text-blue-700";
    case "resolved":
      return "bg-green-100 text-green-700";
    case "closed":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const ComplaintDetails = ({ handleCloseComplaint, uniqueID: propUniqueID }) => {
  const { uniqueID: routeUniqueID } = useParams();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const navigate = useNavigate();
  const uniqueID = propUniqueID || routeUniqueID;

  const fetchGrievanceByUniqueID = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/grievances/grievance/${uniqueID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data;
      console.log(data);
      
      const mapped = {
        _mongoId: data._id,
        id: data.uniqueID,
        title: data.title,
        status: data.status,
        dob: data.dateOfBirth,
        gender: data.gender,
        address: data.addressLine1,
        priority: data.category || "Medium",
        date: data.dateOfIncident
          ? new Date(data.dateOfIncident).toLocaleDateString()
          : "N/A",
          city: data.city,
          district: data.district,
          state: data.state,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
        category: data.category || "General",
        ministry: data.ministryName || "N/A",
        department: data.departmentName || "N/A",
        authority: data.publicAuthority || "N/A",
        location: data.locationOfIssue || "Not specified",
        description: data.grievanceDescription || "No description",
        dateOfIncident: data.dateOfIncident || "N/A",
        citizen: data.fullName || "Citizen",
        email: data.email || "N/A",
        phone: data.phoneNumber || "N/A",
        feedbackGiven: data.feedbackGiven || false,
        isClosed: data.isClosed || false,
        escalatedToLeadOfficer: data.escalatedToLeadOfficer || false,
        attachments: (data.attachments || []).map((f) => ({
          name: f.url?.split("/").pop(),
          url: f.url,
        })),
        // ✅ Updated activityLog mapping
        // activityLog: (data.updates || []).map((log) => ({
        //   message: log.message || "",
        //   date: new Date(log.timestamp).toLocaleString(),
        //   by: log.updatedBy?.fullName || "Unknown",
        //   _id: log._id || null,
        //   timestamp: log.timestamp || null,
        // })),

        progressUpdates: (data.progressUpdates || []).map((log) => ({
          message: log.message || "",
          date: new Date(log.timestamp).toLocaleString(),
          by: log.updatedBy?.fullName || "Unknown",
          progressId: log._id,
          _id: log._id,
          timestamp: log.timestamp || null,
        })),
        activityLog: (data.activityLog || data.recentUpdates || []).map((log) => ({
          _id: log._id,
          status: log.status,
          comment: log.comment,
          timestamp: log.timestamp,
          updatedBy: log.updatedBy?.fullName || "Unknown",
        })),
      };

      setSelectedComplaint(mapped);
    } catch (err) {
      console.error("\u274C Error fetching grievance:", err);
      toast.error("Failed to load complaint.");
    }
  };

  useEffect(() => {
    if (uniqueID) fetchGrievanceByUniqueID();
  }, [uniqueID]);


  const handleStatusUpdate = async (status, comment) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/grievances/status/${selectedComplaint._mongoId}`,
        { status, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const grievance = res?.data?.grievance;
      if (!grievance) {
        alert("No grievance object in response");
        return;
      }

      setSelectedComplaint((prev) => ({
        ...prev,
        status: grievance.status,
        progressUpdates: grievance.progressUpdates || [],
        activityLog: grievance.activityLog || [],
      }));

      setNewStatus("");
      setFinalMessage("");
    } catch (error) {
      console.error("Error updating status:", error);
      alert(
        error?.response?.data?.message ||
        "Failed to update grievance status. Try again later."
      );
    }
  };

  const handleDeleteProgress = async (progressId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this progress update?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    const res = await axios.delete(
      `http://localhost:5000/api/grievances/progress-delete/${selectedComplaint._mongoId}/${progressId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("After delete response:", res?.data?.grievance); 

    const grievance = res?.data?.grievance;

    if (!grievance) {
      alert("No grievance object in response");
      return;
    }

    // ✅ Update the selected complaint
    setSelectedComplaint((prev) => ({
      ...prev,
      status: grievance.status,  // <- this is what you want
      progressUpdates: grievance.progressUpdates || [],
    }));

    alert("Progress update deleted successfully.");
  } catch (err) {
    console.error("Error deleting progress update:", err);
    alert(err?.response?.data?.message || "Failed to delete progress update.");
  }
};

  const handleDeleteStatus = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete the last status update?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/grievances/status-delete/${selectedComplaint._mongoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchGrievanceByUniqueID();
      toast.success("Last status update deleted successfully.");
    } catch (err) {
      console.error("Error deleting status update:", err);
      toast.error(err?.response?.data?.message || "Failed to delete status update.");
    }
  };


  // const handleDeleteActivityLog = async () => {
  //   const confirmDelete = window.confirm("Are you sure you want to delete the last activity log?");
  //   if (!confirmDelete) return;

  //   try {
  //     const token = localStorage.getItem("token");

  //     await axios.delete(
  //       `http://localhost:5000/api/grievances/status-delete/${selectedComplaint._mongoId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     await fetchGrievanceByUniqueID(); // Refresh state
  //     alert("Last activity log deleted successfully");
  //   } catch (err) {
  //     console.error("Error deleting activity log:", err);
  //     alert(err?.response?.data?.message || "Failed to delete activity log.");
  //   }
  // };

  const handleAddUpdate = async (message) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/grievances/progress/${selectedComplaint._mongoId}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Progress update added!");
      setUpdateMessage("");
      fetchGrievanceByUniqueID();
    } catch (error) {
      console.error("Failed to add progress update:", error);
      alert(error?.response?.data?.error || "Error adding progress update.");
    }
  };

  if (!selectedComplaint) return <div className="p-6">Loading complaint...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="bg-white shadow border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Complaints
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Complaint Details</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                {selectedComplaint.status}
              </span>
              {/* <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                {selectedComplaint.priority} Priority
              </span> */}
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="border-b p-4 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">{selectedComplaint.title}</h2>
                <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600 mt-2">
                  <span>{selectedComplaint.id}</span>
                  <span>{selectedComplaint.date}</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {selectedComplaint.category}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-gray-900">Citizen Information</h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{selectedComplaint.citizen}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedComplaint.email || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCircle className="w-4 h-4 text-gray-400" />
                        <span>{selectedComplaint.gender || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>DOB: {selectedComplaint.dob ? new Date(selectedComplaint.dob).toLocaleDateString() : "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>City: {selectedComplaint.city || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>District: {selectedComplaint.district || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>State: {selectedComplaint.state || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Address Line 1: {selectedComplaint.addressLine1 || selectedComplaint.address || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Address Line 2: {selectedComplaint.addressLine2 || "N/A"}</span>
                      </div>
                    </div>
                  </div>


                  <div>
                    <h3 className="text-sm font-semibold mb-2">Location & Grievance Info</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p>{selectedComplaint.locationOfIssue || selectedComplaint.location || "N/A"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>Category: {selectedComplaint.category || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Date of Incident: {selectedComplaint.dateOfIncident? new Date(selectedComplaint.dateOfIncident).toLocaleDateString() : "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>Department: {selectedComplaint.department||  "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>Ministry: {selectedComplaint.ministry || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>Public Authority: {selectedComplaint.authority || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">Description</h3>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200 text-gray-700">
                    {selectedComplaint.description}
                  </div>
                </div>

                {selectedComplaint.attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Attachments</h3>
                    <div className="space-y-2">
                      {selectedComplaint.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between border p-3 rounded bg-white hover:shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="truncate text-sm font-medium">{file.name}</span>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-50 text-xs"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Activity Timeline</h3>
                  {selectedComplaint.progressUpdates?.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {selectedComplaint.progressUpdates.map((update) => (
                        <li
                          key={update._id}
                          className="border border-gray-300 rounded p-3 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-sm">{update.message}</p>
                            <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteProgress(update._id)}
                            className="text-red-500 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 mt-2">No progress updates available.</p>
                  )}
                </div>


              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Status Update Box */}
            <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="border-b p-4 bg-gray-50 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">Update Status</h3>
              </div>
              <div className="p-4 space-y-3">
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Select new status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>

                {newStatus === "resolved" && (
                  <textarea
                    className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
                    placeholder="Final resolution message"
                    rows={4}
                    value={finalMessage}
                    onChange={(e) => setFinalMessage(e.target.value)}
                  />
                )}

                <button
                  onClick={() => handleStatusUpdate?.(newStatus, finalMessage)}
                  disabled={!newStatus}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" /> Update Status
                </button>
              </div>
            </div>

            {/* Status History Card */}
            <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="border-b p-4 bg-gray-50 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">Status History</h3>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {selectedComplaint.activityLog && selectedComplaint.activityLog.filter(
                  (log) => ["In Progress", "Resolved", "Closed"].includes((log.status || "").replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
                ).length > 0 ? (
                  <>
                    <ul className="space-y-3">
                      {selectedComplaint.activityLog
                        .filter((log) => ["In Progress", "Resolved", "Closed"].includes((log.status || "").replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())))
                        .map((log) => (
                          <li key={log._id} className="flex items-center justify-between bg-white border border-blue-100 rounded-lg shadow-sm p-3 hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(log.status)}`}>{log.status}</span>
                              <span className="text-xs text-gray-500">{log.timestamp ? new Date(log.timestamp).toLocaleString() : ""}</span>
                              {log.comment && <span className="text-xs text-gray-700 italic">{log.comment}</span>}
                            </div>
                          </li>
                        ))}
                    </ul>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleDeleteStatus}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded flex items-center justify-center gap-2 text-sm"
                        title="Delete last status update"
                      >
                        <X className="w-4 h-4" /> Delete Last Status
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">No status history available.</p>
                )}
              </div>
            </div>

            {/* <div className="mt-6">
              <h3 className="text-lg font-semibold">Progress Updates</h3>
              {selectedComplaint.progressUpdates?.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {selectedComplaint.progressUpdates.map((update) => (
                    <li
                      key={update._id}
                      className="border border-gray-300 rounded p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm">{update.message}</p>
                        <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteProgress(update._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mt-2">No progress updates available.</p>
              )}
            </div> */}


            {/* Add Update Box */}
            <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
              {/* Header */}
              <div className="border-b p-4 bg-gray-50 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">Add Update</h3>
              </div>

              {/* Add Update Input */}
              <div className="p-4 space-y-3">
                <textarea
                  className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
                  placeholder="Update message for citizen"
                  rows={3}
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                />
                <button
                  onClick={async () => {
                    await handleAddUpdate(updateMessage);
                    setUpdateMessage(""); // clear only after success
                  }}
                  disabled={!updateMessage.trim()}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" /> Add Update
                </button>
              </div>
            </div>


            {/* Close Complaint Box */}
            {selectedComplaint.status === "resolved" && (
              <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="border-b p-4 bg-gray-50 flex items-center gap-2">
                  <X className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Close Complaint</h3>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-gray-600">Mark as closed with feedback:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCloseComplaint?.("positive")}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2 text-sm"
                    >
                      <ThumbsUp className="w-4 h-4" /> Positive
                    </button>
                    <button
                      onClick={() => handleCloseComplaint?.("negative")}
                      className="border border-red-300 text-red-600 hover:bg-red-50 py-2 rounded flex items-center justify-center gap-2 text-sm"
                    >
                      <ThumbsDown className="w-4 h-4" /> Negative
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
