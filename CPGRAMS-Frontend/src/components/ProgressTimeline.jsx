import React from 'react';
import { Calendar, FileText, User, Clock, CheckCircle2, Lock } from 'lucide-react';

const ProgressTimeline = ({ grievanceData }) => {
  // Define timeline steps with their icons and status
  const timelineSteps = [
    {
      id: 'submitted',
      status: 'Submitted',
      description: 'Complaint submitted successfully via online portal',
      icon: FileText,
      isCompleted: true, // Always completed since grievance exists
      isActive: false,
      timestamp: grievanceData?.createdAt ? new Date(grievanceData.createdAt).toLocaleDateString() : '',
      time: grievanceData?.createdAt ? new Date(grievanceData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    },
    {
      id: 'assigned',
      status: 'Assigned',
      description: grievanceData?.assignedOfficer 
        ? `Complaint assigned to ${grievanceData.assignedOfficer}`
        : 'Complaint assigned to technical officer',
      icon: User,
      isCompleted: grievanceData?.status && ['assigned', 'in_progress', 'in progress', 'resolved', 'closed'].includes(grievanceData.status.toLowerCase()),
      isActive: grievanceData?.status && ['assigned'].includes(grievanceData.status.toLowerCase()),
      timestamp: grievanceData?.assignedAt ? new Date(grievanceData.assignedAt).toLocaleDateString() : '',
      time: grievanceData?.assignedAt ? new Date(grievanceData.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    },
    {
      id: 'in_progress',
      status: 'In Progress',
      description: grievanceData?.progressUpdate || 'Work in progress. Technical team is investigating the issue.',
      icon: Clock,
      isCompleted: grievanceData?.status && ['resolved', 'closed'].includes(grievanceData.status.toLowerCase()),
      isActive: grievanceData?.status && ['in_progress', 'in progress'].includes(grievanceData.status.toLowerCase()),
      timestamp: grievanceData?.inProgressAt ? new Date(grievanceData.inProgressAt).toLocaleDateString() : '',
      time: grievanceData?.inProgressAt ? new Date(grievanceData.inProgressAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    },
    {
      id: 'resolved',
      status: 'Resolved',
      description: grievanceData?.resolutionMessage || grievanceData?.resolutionNote || 'Issue has been resolved and closed',
      icon: CheckCircle2,
      isCompleted: grievanceData?.status && ['resolved', 'closed'].includes(grievanceData.status.toLowerCase()),
      isActive: grievanceData?.status && ['resolved'].includes(grievanceData.status.toLowerCase()),
      timestamp: grievanceData?.resolvedAt ? new Date(grievanceData.resolvedAt).toLocaleDateString() : '',
      time: grievanceData?.resolvedAt ? new Date(grievanceData.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    },
    {
      id: 'closed',
      status: 'Closed',
      description: grievanceData?.closureMessage || grievanceData?.closureNote || 'Grievance case has been officially closed',
      icon: Lock,
      isCompleted: grievanceData?.status && ['closed'].includes(grievanceData.status.toLowerCase()),
      isActive: grievanceData?.status && ['closed'].includes(grievanceData.status.toLowerCase()),
      timestamp: grievanceData?.closedAt ? new Date(grievanceData.closedAt).toLocaleDateString() : '',
      time: grievanceData?.closedAt ? new Date(grievanceData.closedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Progress Timeline</h3>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Timeline steps */}
        <div className="space-y-6">
          {timelineSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isLast = index === timelineSteps.length - 1;

            return (
              <div key={step.id} className="relative flex items-start">
                {/* Icon */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  step.isCompleted 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : step.isActive
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`font-semibold text-lg ${
                        step.isCompleted || step.isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.status}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        step.isCompleted || step.isActive ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                    
                    {/* Timestamp */}
                    <div className="text-right ml-4">
                      <div className={`text-xs ${
                        step.isCompleted || step.isActive ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.timestamp}
                      </div>
                      <div className={`text-xs ${
                        step.isCompleted || step.isActive ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.time}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connecting line (except for last item) */}
                {!isLast && (
                  <div className={`absolute left-6 top-12 w-0.5 h-6 ${
                    step.isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressTimeline; 