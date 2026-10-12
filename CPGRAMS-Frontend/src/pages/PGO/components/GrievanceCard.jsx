import React from "react";
import { FileText } from "lucide-react";

const statusColorMap = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Resolved: "bg-green-100 text-green-800",
};

const priorityColorMap = {
    High: "bg-orange-100 text-orange-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
};

const GrievanceCard = ({ grievance }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200 w-full">
            <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                    <h3 className="text-md font-semibold text-gray-800">{grievance.title}</h3>
                    <span className="text-xs text-gray-500">{grievance.id}</span>
                </div>
                <div className="flex gap-2">
                    <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${statusColorMap[grievance.status]}`}
                    >
                        {grievance.status}
                    </span>
                    <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColorMap[grievance.priority]}`}
                    >
                        {grievance.priority}
                    </span>
                </div>
            </div>

            <p className="break-words whitespace-pre-wrap">{grievance.description}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                <div>
                    <span className="font-medium">👤 Citizen:</span> {grievance.citizen}
                </div>
                <div>
                    <span className="font-medium">📂 Category:</span> {grievance.category}
                </div>
                <div>
                    <span className="font-medium">🕒 Submitted:</span> {grievance.submitted}
                </div>
                <div>
                    <span className="font-medium">📅 Due:</span> {grievance.due}
                </div>
            </div>
        </div>
    );
};

export default GrievanceCard;
