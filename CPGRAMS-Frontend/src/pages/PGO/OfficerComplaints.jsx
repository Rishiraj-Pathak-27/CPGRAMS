import { useState, useEffect, useMemo } from "react";
import { Search, FileText, Eye, MessageSquare } from "lucide-react";
import ComplaintDetails from "./ComplaintDetails";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// import AssignOfficerModal from '../../components/AssignOfficerModal';
import { useRef } from "react";
import { showToast } from "../../utils/customToast";
import Pagination from "../../components/Pagination";

const OfficerComplaints = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [assignDropdownOpenId, setAssignDropdownOpenId] = useState(null);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [dropdownOfficers, setDropdownOfficers] = useState([]);
  const [dropdownAnchor, setDropdownAnchor] = useState({});
  const [officerNames, setOfficerNames] = useState({});
  // const [officerNamesCache, setOfficerNamesCache] = useState({});
  const assignBtnRef = useRef({});
  const [assignBtnLoadingId, setAssignBtnLoadingId] = useState(null);
  const [unassignBtnLoadingId, setUnassignBtnLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const userData = JSON.parse(localStorage.getItem("user"));
  const isOfficer = userData?.role === "officer";

  const handleOpenAssign = async (complaintId, e) => {
    e.stopPropagation();
    setAssignDropdownOpenId(complaintId);
    setDropdownLoading(true);
    setDropdownOfficers([]);
    // Position dropdown below button
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownAnchor({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width
    });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/officer/all-officers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDropdownOfficers(res.data.officers || []);
    } catch (err) {
      setDropdownOfficers([]);
    } finally {
      setDropdownLoading(false);
    }
  };

  const handleAssignOfficerDropdown = async (complaintId, officerId) => {
    setAssignBtnLoadingId(complaintId);
    await handleAssignOfficer(complaintId, officerId);
    await fetchComplaints();
    setAssignDropdownOpenId(null);
    setAssignBtnLoadingId(null);
  };


  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const endpoint = isOfficer
        ? "http://localhost:5000/api/officer/assigned-grv"
        : "http://localhost:5000/api/grievances/getallgrv";

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = isOfficer ? response.data.grievances : response.data.grievances;

      const mapped = data.map((data) => ({
        _id: data._id,
        id: data.uniqueID,
        title: data.title,
        citizen: data.fullName || data.user?.fullName || "N/A",
        email: data.email || data.user?.email || "N/A",
        phone: data.phoneNumber || data.user?.phoneNumber || "N/A",
        location: data.locationOfIssue || "Not specified",
        description: data.grievanceDescription || "No description",
        attachments: (data.attachments || []).map((f) => ({
          name: f.url.split("/").pop(),
          url: f.url,
        })),
        category: data.departmentName || "General",
        ministry: data.ministryName || "N/A",
        authority: data.publicAuthority || "N/A",
        status: data.status,
        assignedTo: data.assignedTo || null,
        assignedBy: data.assignedOfficer || null,
        assigned: !!data.assignedTo || data.status === "In Progress",
        priority: data.category?.toLowerCase() || "medium",
        date: data.dateOfIncident
          ? new Date(data.dateOfIncident).toLocaleDateString()
          : "N/A",
        feedbackGiven: data.feedbackGiven || false,
        isClosed: data.isClosed || false,
        escalatedToLeadOfficer: data.escalatedToLeadOfficer || false,
        updates: [
          ...(data.activityLog || []).map((log) => ({
            message: log.message || log.comment || "",
            date: new Date(log.timestamp).toLocaleString(),
            by: log.updatedBy?.fullName || "Unknown",
          })),
          ...(data.progressUpdates || []).map((log) => ({
            message: log.message || "",
            date: new Date(log.timestamp).toLocaleString(),
            by: log.updatedBy?.fullName || "Unknown",
          })),
        ],
      }));

      setComplaints(mapped);
    } catch (err) {
      console.error("Error fetching complaints", err);
      // setError("Failed to load complaints.");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);


  // const handleOpenAssign = (complaintId) => {
  //   setComplaintToAssign(complaintId);
  //   setAssignModalOpen(true);
  // };

  const handleAssignOfficer = async (complaintId, officerId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/officer/assign`,
        { grievanceId: complaintId, officerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedGrievance = res.data;

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId
            ? {
                ...c,
                status: updatedGrievance.status,
                assigned: true,
                assignedTo: updatedGrievance.assignedTo, // 👈 this updates officer info
              }
            : c
        )
      );

      // setAssignModalOpen(false); // 👈 close the modal
      showToast("Officer assigned successfully!", "success");
    } catch (err) {
      console.error("Assignment failed", err);
      showToast("Failed to assign officer.", "error");
    }
  };


  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch =
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.citizen.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        complaint.status.toLowerCase() === filterStatus.toLowerCase();

      const matchesPriority =
        filterPriority === "all" ||
        complaint.priority.toLowerCase() === filterPriority.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, searchTerm, filterStatus, filterPriority]);

  const getStatusColor = (status) => {
    switch (status) {
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
    switch (priority) {
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
  const handleStatusUpdate = (newStatus, finalMessage) => {
    if (!newStatus) return;
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint.id
          ? {
            ...c,
            status: newStatus,
            updates: [
              ...c.updates,
              {
                message:
                  newStatus === "resolved"
                    ? `marked as resolved ${finalMessage} || ""}`
                    : `status Changed to ${newStatus}`,
                date: new Date().toLocaleString(),
                by: "Officer",
              },
            ],
          }
          : c
      )
    );
  };
  const handleAddUpdate = (updateMessage) => {
    if (!updateMessage.trim()) return;
    const newUpdate = {
      message: updateMessage,
      date: new Date().toLocaleString(),
      by: "Officer",
    };
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint.id
          ? {
            ...c,
            updates: [
              ...c.updates,
              newUpdate,
            ]
          }
          : c
      )
    );
    setSelectedComplaint((prev) => ({
      ...prev,
      updates: [...prev.updates, newUpdate],
    }));
  };
  const handleCloseComplaint = (feedback) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint.id
          ? {
            ...c,
            status: "closed",
            feedback: feedback || "",
            updates: [
              ...c.updates,
              {
                message: `Complaint closed with feedback: ${feedback || "No feedback provided"}`,
                date: new Date().toLocaleString(),
                by: "Officer",
              },
            ],
          }
          : c
      )
    );
  }

  useEffect(() => {
    const loadOfficerNames = async () => {
      const namesMap = { ...officerNames };
      let changed = false;

      for (const complaint of filteredComplaints) {
        if (complaint._id && !namesMap[complaint._id]) {
          const { assignedToName, assignedOfficerName, assignedDate } = await fetchOfficerNames(complaint._id);
          namesMap[complaint._id] = {
            assignedToName,
            assignedOfficerName,
            assignedDate,
          };
          changed = true;
        }
      }

      if (changed) {
        setOfficerNames(namesMap);
      }
    };

    loadOfficerNames();
  }, [filteredComplaints]);




  const fetchOfficerNames = async (grievanceId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/officer/grievance/${grievanceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const grievance = res.data.grievance;

      return {
        assignedToName: grievance.assignedTo?.fullName || null,
        assignedOfficerName: grievance.assignedOfficer?.fullName || null,
        assignedDate: grievance.assignedDate || null,
      };
    } catch (error) {
      console.error("Error fetching officer names:", error);
      return {
        assignedToName: null,
        assignedOfficerName: null,
        assignedDate: null,
      };
    }
  };

  const handleUnassign = async (complaintId) => {
    setUnassignBtnLoadingId(complaintId);
    try {
      await axios.put(
        "http://localhost:5000/api/officer/unassign",
        { grievanceId: complaintId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchComplaints();
      showToast("Officer unassigned successfully!", "success");
    } catch (error) {
      console.error("Failed to unassign:", error);
      showToast("Failed to unassign officer.", "error");
    }
    setUnassignBtnLoadingId(null);
  };

  // Pagination logic for filteredComplaints
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selectedComplaint) {
    return (
      <ComplaintDetails
        selectedComplaint={selectedComplaint}
        setSelectedComplaint={setSelectedComplaint}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
        handleStatusUpdate={handleStatusUpdate}
        handleAddUpdate={handleAddUpdate}
        handleCloseComplaint={handleCloseComplaint}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg rounded-lg p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Complaints Management
              </h1>
              <p className="text-blue-100 text-lg ">
                Manage and Track all Assigned complaints efficiently
              </p>
            </div>
          </div>
          {/* Filters */}
          <div className="mb-6 shadow-sm bg-white/80 backdrop-blur-sm rounded-lg p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search complaints..."
                  className="pl-10 border-2 border-gray-200 focus:border-blue-400 rounded-lg w-full py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="border-2 border-gray-200 focus:border-blue-400 rounded-lg w-full py-2 px-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                className="border-2 border-gray-200 focus:border-blue-400 rounded-lg w-full py-2 px-2"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <div className="text-sm text-gray-600 flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2 border">
                <strong>{filteredComplaints.length}</strong>&nbsp;complaints found
              </div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="shadow-lg bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden p-4">
            <div className="bg-gradient-to-r from-gray-50 to-slate-100 border-b border-gray-200 p-4 md:p-6">
              <div className=" text-2xl font-bold text-gray-800 flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-600" />
                Assigned Complaints
              </div>
              <p className="text-gray-600">
                Click on any complaint to view details and manage
              </p>
            </div>

            {filteredComplaints.length > 0 ? (
              <div className="overflow-x-auto ">
                <table className="w-full text-left-10  ">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="p-2">Complaint ID</th>
                      <th className="p-2">Title</th>
                      <th className="p-2 hidden sm:table-cell">Citizen</th>
                      <th className="p-2 hidden md:table-cell">Category</th>
                      <th className="p-2">Status</th>
                      <th className="p-2 hidden xl:table-cell">Date</th>

                      {!isOfficer ? (
                        <>
                          <th className="p-2">Actions</th>
                          <th className="p-2">Assigned To</th>
                        </>
                      ) : (
                        <th className="p-2">Assigned By</th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {currentComplaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        onClick={() => navigate(`/PGO-Dashboard/ofc-com/${complaint.id}`)}
                      >
                        <td className="font-mono p-2 text-sm font-medium text-blue-600">
                          {complaint.id}
                        </td>
                        <td className="p-2 font-medium text-gray-900 max-w-xs truncate">
                          {complaint.title}
                        </td>
                        <td className="p-2 text-gray-700 hidden sm:table-cell">
                          {complaint.citizen}
                        </td>
                        <td className="p-2 text-gray-600 hidden md:table-cell">
                          {complaint.category}
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold ${getStatusColor(
                              complaint.status
                            )}`}
                          >
                            {complaint.status}
                          </span>
                        </td>
                        <td className="p-2 text-gray-600 hidden xl:table-cell">
                          {officerNames[complaint._id]?.assignedDate
                            ? new Date(officerNames[complaint._id].assignedDate).toLocaleDateString()
                            : "--"}
                        </td>

                        {!isOfficer ? (
                          <>
                            <td className="p-2">
                              <div className="flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/PGO-Dashboard/ofc-com/${complaint.id}`);
                                  }}
                                >
                                  <Eye className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                                </button>

                                {complaint.assignedTo ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnassign(complaint._id || complaint.id);
                                    }}
                                    className="px-2 py-1 border border-red-200 text-red-600 hover:bg-red-50 text-xs rounded flex items-center gap-1"
                                    disabled={unassignBtnLoadingId === (complaint._id || complaint.id)}
                                  >
                                    {unassignBtnLoadingId === (complaint._id || complaint.id) && (
                                      <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                      </svg>
                                    )}
                                    Unassign
                                  </button>
                                ) : (
                                  <div className="relative inline-block">
                                    <button
                                      ref={el => assignBtnRef.current[complaint._id || complaint.id] = el}
                                      onClick={(e) => handleOpenAssign(complaint._id || complaint.id, e)}
                                      className="px-3 py-1 border border-green-200 text-green-600 hover:bg-green-50 text-xs rounded-lg font-medium shadow-sm transition-all duration-150 flex items-center gap-1"
                                      disabled={assignBtnLoadingId === (complaint._id || complaint.id)}
                                    >
                                      {assignBtnLoadingId === (complaint._id || complaint.id) && (
                                        <svg className="animate-spin h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                      )}
                                      Assign
                                    </button>
                                    {assignDropdownOpenId === (complaint._id || complaint.id) && (
                                      <div
                                        className="absolute z-50 mt-1 bg-white border border-green-200 rounded-lg shadow-lg p-1 min-w-[80px] max-w-[200px]"
                                        style={{
                                          left: 0,
                                          width: assignBtnRef.current[complaint._id || complaint.id]?.offsetWidth || 'auto',
                                        }}
                                      >
                                        {dropdownLoading ? (
                                          <div className="flex items-center justify-center py-1">
                                            <svg className="animate-spin h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                          </div>
                                        ) : (
                                          <>
                                            {dropdownOfficers.length === 0 ? (
                                              <div className="text-xs text-gray-500 py-1 px-2">No officers</div>
                                            ) : (
                                              <ul className="max-h-40 overflow-y-auto">
                                                {dropdownOfficers.map((officer) => (
                                                  <li key={officer._id}>
                                                    <button
                                                      className="w-full text-left px-3 py-1 rounded-lg hover:bg-green-50 text-xs text-gray-700 transition-all"
                                                      style={{ fontSize: '12px' }}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAssignOfficerDropdown(complaint._id || complaint.id, officer._id);
                                                      }}
                                                    >
                                                      {officer.fullName}
                                                    </button>
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                            <button
                                              className="w-full mt-1 text-xs text-gray-400 hover:text-gray-700 py-1 rounded-lg"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setAssignDropdownOpenId(null);
                                              }}
                                            >
                                              Cancel
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="p-2">
                              {Object.prototype.hasOwnProperty.call(officerNames, complaint._id) ? (
                                officerNames[complaint._id]?.assignedToName || (
                                  <span className="italic text-gray-400">Not assigned</span>
                                )
                              ) : (
                                <span className="italic text-gray-400">Loading...</span>
                              )}
                            </td>


                          </>
                        ) : (
                          <td className="p-2">
                            {Object.prototype.hasOwnProperty.call(officerNames, complaint._id) ? (
                              officerNames[complaint._id]?.assignedOfficerName || (
                                <span className="italic text-gray-400">Not assigned</span>
                              )
                            ) : (
                              <span className="italic text-gray-400">Loading...</span>
                            )}
                          </td>


                        )}

                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Component */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredComplaints.length}
                  showItemsPerPage={true}
                />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">
                  No complaints found matching your criteria.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search or filter settings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default OfficerComplaints;
