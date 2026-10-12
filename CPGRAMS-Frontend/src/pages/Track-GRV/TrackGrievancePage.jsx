import react, { useState } from "react";
import axios from "axios";
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  User,
  Calendar,
  MapPin,
  Phone,
  ArrowLeft,
  Shield,
} from "lucide-react";
import HeaderLayout from "../../components/header/Header-Layout/HeaderLayout";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/MainHeader";
import ProgressTimeline from "../../components/ProgressTimeline";

const TrackGrievancePage = () => {
  const [activeTab, setActiveTab] = useState("grievance");
  const [trackingData, setTrackingData] = useState({ token: "", email: "" });
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleInputChange = (field, value) => {
    setTrackingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTrack = async () => {
    setError("");
    if (!trackingData.token || !trackingData.email) {
      alert("Please enter all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:5000/api/grievances/track',
        {
          email: trackingData.email,
          uniqueID: trackingData.token
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      console.log("tracked data", data);


      const mappedComplaint = {
        token: trackingData.token,
        title: data.grievanceDetails?.title || "NA",
        category: data.grievanceDetails?.category || "NA",
        status: data.currentStatus || "NA",
        submissionDate: data.grievanceDetails?.createdAt ? new Date(data.grievanceDetails.createdAt).toLocaleDateString() : "NA",
        attachments: data.grievanceDetails?.attachments || [],
        publicAuthority: data.grievanceDetails?.publicAuthority || "NA",
        ministry: data.grievanceDetails?.ministry || "NA",
        userCity: data.personalInfo?.city || "NA",
        userState: data.personalInfo?.state || "NA",
        userDistrict: data.personalInfo?.district || "NA",
        userName: data.personalInfo?.name || "NA",
        expectedResolution: "NA",
        assignedOfficer: data.assignedTo || "NA",
        officerContact: data.assignedOfficerPhone || "NA",
        officerDepatment: data.assignedOfficerDepartment || "NA",
        department: data.grievanceDetails?.department || "NA",
        location: data.grievanceDetails?.location || "NA",
        description: data.grievanceDetails?.description || "NA",
        timeline: data.recentUpdates?.map((update, index) => ({
          date: new Date(update.timestamp || update.createdAt).toLocaleDateString(),
          time: new Date(update.timestamp || update.createdAt).toLocaleTimeString(),
          status: update.status || update.action || "Update",
          description: update.comment || update.message || "Status updated",
          icon: index === 0 ? FileText : index === 1 ? User : CheckCircle,
          completed: true,
        })) || [],
        updates: data.progressUpdates?.map(update => ({
          date: new Date(update.timestamp).toLocaleDateString(),
          message: update.message || "Progress update",
          type: "progress",
        })) || [],
      };

      setComplaint(mappedComplaint);
      setError("");
    } catch (err) {
      console.error('Error tracking grievance:', err);
      setComplaint(null);
      if (err.response?.status === 404) {
        setError("Invalid Token or No Grievance Found");
      } else {
        setError("An error occurred while tracking the grievance");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTrackingData({ token: "", email: "" });
    setComplaint(null);
    setError("");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
        <div className="w-full md:w-56 bg-blue-800 text-white flex flex-col items-center py-8 md:py-10 relative">
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 left-4 text-white hover:underline flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <div className="mt-12 flex flex-col gap-4 w-full px-4">
            <button
              onClick={() => setActiveTab("grievance")}
              className={`w-full text-left px-4 py-2 rounded ${activeTab === "grievance"
                ? "bg-white text-blue-800 font-semibold "
                : "hover:bg-blue-700"
                }`}
            >
              Track Grievance
            </button>
            <button
              onClick={() => setActiveTab("appeal")}
              className={`w-full text-left px-4 py-2 rounded ${activeTab === "appeal"
                ? "bg-white text-blue-800 font-semibold"
                : "hover:bg-blue-700"
                }`}
            >
              Track Appeal
            </button>
          </div>
        </div>
        <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-slate-50 w-full">
          <div className="max-w-5xl mx-auto space-y-6 ">
            <h1 className="text-3xl font-bold mb-2">
              {activeTab === "grievance"
                ? "Track Your Grievance"
                : "Track Your Appeal"}
            </h1>
            <p className="text-gray-600 mb-6">
              Enter details to monitor the status of your {activeTab}.
            </p>

            <div className="bg-white shadow rounded p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
                <Search className="w-5 h-5" /> Enter Tracking Details
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">
                    {activeTab === "grievance"
                      ? "Complaint Token Number"
                      : "Appeal Number"}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      activeTab === "grievance"
                        ? "e.g., GRV2024001234"
                        : "e.g., APP2024005678"
                    }
                    value={trackingData.token}
                    onChange={(e) => handleInputChange("token", e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={trackingData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <button
                onClick={handleTrack}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" /> Track{" "}
                    {activeTab === "grievance" ? "Grievance" : "Appeal"}
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded flex items-center gap-4">
                <Shield className="w-6 h-6 text-red-500" />
                <div>
                  <p className="font-semibold">{error}</p>
                  <p className="text-sm">
                    Please verify your{" "}
                    {activeTab === "grievance"
                      ? "token number"
                      : "appeal number"}{" "}
                    and email.
                  </p>
                </div>
              </div>
            )}

            {complaint && (
              <div className="border-2 border-blue-200 rounded-md p-6 space-y-4">
                <div className="bg-white shadow rounded p-6 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {complaint.title}
                      </h2>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" /> Token:{" "}
                          <span className="font-mono">{complaint.token}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {complaint.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="px-2 py-1 text-xs rounded bg-blue-500 text-white">
                        {complaint.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{complaint.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="font-medium">{complaint.submissionDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Attachments</p>
                      {complaint.attachments && complaint.attachments.length > 0 ? (
                        <button
                          onClick={() => setIsOpen(true)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          See Attachments
                        </button>
                      ) : (
                        <p className="font-medium text-gray-400">No attachments</p>
                      )}

                      {isOpen && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
                          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                            <h2 className="text-xl font-semibold mb-4">Attachments</h2>

                            <button
                              onClick={() => setIsOpen(false)}
                              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                            >
                              &times;
                            </button>

                            <ul className="space-y-3">
                              {complaint.attachments.map((file, index) => (
                                <li key={file._id || index}>
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline block"
                                  >
                                    Attachment {index + 1}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <hr />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Ministry</p>
                      <p className="font-medium">{complaint.ministry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{complaint.officerDepatment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Public Authority</p>
                      <p className="font-medium flex items-center gap-1">
                        {complaint.publicAuthority}
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-sm">{complaint.description}</p>
                  </div>
                </div>

                <div className="bg-white shadow rounded p-6 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{complaint.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium">{complaint.userCity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">District</p>
                      <p className="font-medium">{complaint.userDistrict}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">State</p>
                      <p className="font-medium">{complaint.userState}</p>
                    </div>

                  </div>
                </div>

                <div className="bg-white shadow rounded p-6 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Assigned Officer
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Officer Name</p>
                      <p className="font-medium">{complaint.assignedOfficer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{complaint.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {complaint.officerContact}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Progress Timeline */}
                <ProgressTimeline grievanceData={{
                  status: complaint.status?.toLowerCase(),
                  createdAt: complaint.submissionDate,
                  assignedOfficer: complaint.assignedOfficer,
                  progressUpdate: complaint.updates.length > 0 ? complaint.updates[0]?.message : null,
                  // Extract resolution message from timeline or updates
                  resolutionMessage: complaint.timeline?.find(item => 
                    item.status?.toLowerCase().includes('resolved')
                  )?.description || 
                  complaint.updates?.find(update => 
                    update.message?.toLowerCase().includes('resolved')
                  )?.message || null,
                  // Extract closure message from timeline or updates
                  closureMessage: complaint.timeline?.find(item => 
                    item.status?.toLowerCase().includes('closed')
                  )?.description || 
                  complaint.updates?.find(update => 
                    update.message?.toLowerCase().includes('closed')
                  )?.message || null,
                  // Fallback messages
                  resolutionNote: complaint.status === 'Resolved' ? 'Issue has been resolved and closed' : null,
                  closureNote: complaint.status === 'Closed' ? 'Grievance case has been officially closed' : null,
                  // Map the timeline data from the API response
                  timeline: complaint.timeline,
                  updates: complaint.updates,
                  // Add timestamps if available in the API response
                  assignedAt: complaint.timeline?.find(item => item.status?.toLowerCase().includes('assigned'))?.date,
                  inProgressAt: complaint.timeline?.find(item => item.status?.toLowerCase().includes('progress'))?.date,
                  resolvedAt: complaint.timeline?.find(item => item.status?.toLowerCase().includes('resolved'))?.date,
                  closedAt: complaint.timeline?.find(item => item.status?.toLowerCase().includes('closed'))?.date,
                }} />

                <div className="bg-white shadow rounded p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Recent Updates</h3>
                  {complaint.updates.length > 0 ? (
                    complaint.updates.map((update, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-300 pl-4"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-xs px-2 py-1 rounded ${update.type === "progress"
                              ? "bg-blue-100"
                              : "bg-gray-200"
                              }`}
                          >
                            {update.type === "progress"
                              ? "Progress Update"
                              : "Information"}
                          </span>
                          <span>{update.date}</span>
                        </div>
                        <p className="text-sm">{update.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No recent updates available</p>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default TrackGrievancePage;