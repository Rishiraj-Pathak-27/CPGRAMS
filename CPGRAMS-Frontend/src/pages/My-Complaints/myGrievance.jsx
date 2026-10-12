import React, { useEffect, useState } from 'react';
import { Plus, FileText, Bell, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import FeedbackForm from '../../components/FeedbackForm';
import GrievanceDetails from '../../components/GrievanceDetails';
import MainNavbar from '../../components/header/MainHeader';
import HeaderLayout from '../../components/header/Header-Layout/HeaderLayout';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/MainHeader';
import Pagination from '../../components/Pagination';
import axios from 'axios';
import { showToast } from "../../utils/customToast";

const statusColorMap = {
    resolved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
};
const priorityColorMap = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
};

const getStatusColor = (status) =>
    statusColorMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';

const getPriorityColor = (priority) =>
    priorityColorMap[priority?.toLowerCase()] || 'bg-gray-100 text-gray-800';

const MyGrievances = ({ complaints = [], setShowForm }) => {
    const [myGrievance, setMyGrievance] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        const fetchMyComplaints = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get("http://localhost:5000/api/grievances/my-grievances", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // console.log("fetchMyComplaints",res.data);
                setMyGrievance(res.data)
            } catch (error) {
                console.log(error);
            }
        };

        fetchMyComplaints();
    }, []);

    console.log(myGrievance);

    const [feedbackGrievanceId, setFeedbackGrievanceId] = useState(null);
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [activeTab, setActiveTab] = useState("mygrievance");

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentGrievances = myGrievance.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(myGrievance.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openDetailsModal = (grievance) => {
        setSelectedGrievance(grievance);
    };

    // const handleFeedbackSubmit = ({ grievanceId, feedback, rating }) => {
    //     console.log('Feedback submitted:', { grievanceId, feedback, rating });
    //     setFeedbackGrievanceId(null);
    // };

    const openFeedbackForm = (uniqueID) => {
        setFeedbackGrievanceId(uniqueID);
    };

    const handleSendReminder = async (grievanceId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                `http://localhost:5000/api/grievances/reminder/${grievanceId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = res.data;
            showToast(
                `Reminder sent to ${data.recipient.name} (${data.recipient.email})`,
                "success"
            );
        } catch (err) {
            console.error("Error sending reminder:", err);
            showToast("Failed to send reminder. Please try again later.", "error");
        }
    };

    const handleFeedbackSubmit = async ({ grievanceId, feedback, rating }) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                `http://localhost:5000/api/grievances/submit/${grievanceId}`,
                {
                    rating,
                    message: feedback,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            showToast("Feedback submitted successfully. Thank you!", "success");
            setFeedbackGrievanceId(null);
        } catch (err) {
            console.error("Error submitting feedback:", err);
            showToast("Failed to submit feedback. Please try again later.", "error");
        }
    };



    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text('My Grievances', 14, 16);

        const tableData = myGrievance.map((complaint, index) => [
            index + 1,
            complaint.uniqueID,
            complaint.title,
            complaint.category,
            complaint.status,
            new Date(complaint.createdAt).toLocaleDateString(),
        ]);

        autoTable(doc, {
            startY: 20,
            head: [[
                'S.No',
                'Grievance ID',
                'Title',
                'Category',
                'Status',
                'Submitted',
            ]],
            body: tableData,
        });

        doc.save('my-grievances.pdf');
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
                <div className='w-full md:w-56 bg-blue-800 text-white flex flex-col items-center py-8 md:py-10 relative'>
                    <button
                        onClick={() => window.history.back()}
                        className="absolute top-4 left-4 text-white hover:underline flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                    <div className="mt-12 flex flex-col gap-4 w-full px-4">
                        <button
                            className={`w-full text-left px-4 py-2 rounded ${activeTab === "mygrievance"
                                ? "bg-white text-blue-800 font-semibold "
                                : "hover:bg-blue-700"
                                }`}
                        >
                            My Grievance
                        </button>
                    </div>
                </div>
                <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-slate-50 w-full">
                    {/* Header */}
                    <div className="max-w-7xl  space-y-6">
                        <h1 className="text-3xl font-bold mb-2">
                            My Grievances
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Track and manage your submitted grievances
                        </p>
                        {/* <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 rounded-lg shadow"
                    >
                        <Plus className="w-4 h-4" />
                        Submit New Grievance
                    </button> */}
                    </div>

                    {/* Table Card */}
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="border-b-2 border-gray-300 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center text-lg font-semibold text-gray-800 gap-2">
                                <FileText
                                    className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer"
                                    onClick={handleDownloadPDF}
                                    title="Download all grievances as PDF"
                                />
                                Grievance Records
                            </div>
                            {/* <span className="text-sm text-gray-500">Track and manage your submitted grievances</span> */}
                        </div>

                        {/* Table */}
                        <div className="bg-white shadow rounded space-y-4 overflow-x-auto">
                            <table className="min-w-full text-sm table-auto divide-y divide-gray-200">
                                <thead className="bg-gray-50 text-gray-600 font-medium">
                                    <tr>
                                        <th className="p-4 text-left">Grievance ID</th>
                                        <th className="p-4 text-left">Title</th>
                                        <th className="p-4 text-left">Category</th>
                                        <th className="p-4 text-left">Status</th>
                                        {/* <th className="p-4 text-left">Priority</th> */}
                                        <th className="p-4 text-left">Submitted</th>
                                        {/* <th className="p-4 text-left">Last Update</th> */}
                                        <th className="p-4 text-left">View Details</th>
                                        <th className="p-4 text-left">Feedback</th>
                                        <th className="p-4 text-left">Remainder</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentGrievances.map((complaint) => (
                                        <tr key={complaint._id} className="hover:bg-gray-50 transition">
                                            <td className="p-4 font-mono text-xs text-gray-700">{complaint.uniqueID}</td>
                                            <td className="p-4 max-w-xs truncate text-gray-800" title={complaint.title}>
                                                {complaint.title}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 text-xs font-medium">
                                                    {complaint.category}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => openDetailsModal(complaint)}
                                                    className="text-indigo-600 hover:underline text-sm"
                                                >
                                                    View
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => complaint.status === "Resolved" && openFeedbackForm(complaint.uniqueID)}
                                                    disabled={complaint.status !== "Resolved"}
                                                    title={complaint.status === "Resolved"
                                                        ? "Click to provide feedback for this resolved grievance"
                                                        : "Feedback is only available for resolved grievances"
                                                    }
                                                    className={`text-sm underline-offset-2 ${complaint.status === "Resolved"
                                                        ? "text-green-600 hover:underline cursor-pointer"
                                                        : "text-gray-400 cursor-not-allowed"
                                                        }`}
                                                >
                                                    Feedback
                                                </button>
                                            </td>

                                            <td className="p-4">
                                                {(() => {
                                                    const createdDate = new Date(complaint.createdAt);
                                                    const currentDate = new Date();
                                                    const diffTime = currentDate - createdDate;
                                                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                                    const daysLeft = 21 - diffDays;
                                                    const canRemind = diffDays >= 21;

                                                    return (
                                                        <button
                                                            onClick={() => canRemind && handleSendReminder(complaint._id)}
                                                            disabled={!canRemind}
                                                            title={!canRemind
                                                                ? `Reminder will be available after 21 days from creation date. Please wait ${daysLeft} more day${daysLeft !== 1 ? 's' : ''}.`
                                                                : "Click to send a reminder to the assigned officer"
                                                            }
                                                            className={`flex items-center gap-1 text-sm ${canRemind
                                                                ? "text-yellow-600 hover:text-yellow-800 cursor-pointer"
                                                                : "text-gray-400 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            <Bell className="w-4 h-4" />
                                                            Remind Officer
                                                        </button>
                                                    );
                                                })()}
                                            </td>

                                        </tr>
                                    ))}
                                    {currentGrievances.length === 0 && (
                                        <tr>
                                            <td colSpan={10} className="p-6 text-center text-gray-500">
                                                No grievances found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>

                            {/* Pagination Component */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                itemsPerPage={itemsPerPage}
                                totalItems={myGrievance.length}
                                showItemsPerPage={true}
                            />
                        </div>
                    </div>

                    {feedbackGrievanceId && (
                        <FeedbackForm
                            grievanceId={feedbackGrievanceId}
                            onClose={() => setFeedbackGrievanceId(null)}
                            onSubmit={handleFeedbackSubmit}
                        />
                    )}
                    {selectedGrievance && (
                        <GrievanceDetails
                            grievance={selectedGrievance}
                            onClose={() => setSelectedGrievance(null)}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyGrievances;