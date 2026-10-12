import React from 'react';
import {
    X,
    Info,
    AlertCircle,
    Clock,
    ClipboardList,
    FileText,
    Building,
    Landmark,
    Text,
} from 'lucide-react';

const GrievanceDetails = ({ grievance, onClose }) => {
    if (!grievance) return null;

    const statusColor =
        grievance.status === 'Resolved'
            ? 'bg-green-100 text-green-700'
            : grievance.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700';


    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative animate-fade-in">

                {/* Header */}
                <div className="bg-white border-b px-4 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-blue-600" />
                        Grievance Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-5 text-sm text-gray-800 grid grid-cols-2 max-[450px]:grid-cols-1 space-x-2 h-[250px] overflow-y-scroll">
                    <DetailItem
                        icon={<ClipboardList className="text-blue-600" />}
                        label="Grievance ID"
                        value={grievance.uniqueID}
                    />
                    <DetailItem
                        icon={<FileText className="text-green-600" />}
                        label="Title"
                        value={grievance.title}
                    />
                    <DetailItem
                        icon={<Info className="text-yellow-500" />}
                        label="Category"
                        value={grievance.category}
                    />
                    <DetailItem
                        icon={<Building className="text-yellow-500" />}
                        label="Department Name"
                        value={grievance.departmentName}
                    />
                    <DetailItem
                        icon={<AlertCircle className="text-red-500" />}
                        label="Status"
                        value={
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                            >
                                {grievance.status}
                            </span>
                        }
                    />
                    <DetailItem
                        icon={<Clock className="text-gray-500" />}
                        label="Submitted On"
                        value={new Date(grievance.createdAt).toLocaleDateString()}

                    />
                    <DetailItem
                        icon={<Text className="text-gray-500" />}
                        label="Grievance Description" 
                        value={grievance.grievanceDescription}
                    />
                    <DetailItem
                        icon={<Landmark className="text-gray-500" />}
                        label="Ministry Name" 
                        value={grievance.ministryName}
                    />
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Reusable Detail Item component
const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 w-5 h-5">{icon}</div>
        <div>
            <p className="text-xs font-semibold text-gray-500">{label}</p>
            <p className="text-sm font-medium mt-0.5">{value}</p>
        </div>
    </div>
);

export default GrievanceDetails;
