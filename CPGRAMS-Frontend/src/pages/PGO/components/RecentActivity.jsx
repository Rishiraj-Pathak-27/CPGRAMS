import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Info } from 'lucide-react';
import axios from 'axios';
import moment from 'moment';
 
function RecentActivity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
 
  const iconMap = {
    resolved: <CheckCircle className="text-green-600 w-5 h-5" />,
    'in progress': <Clock className="text-yellow-600 w-5 h-5" />,
    assigned: <Info className="text-blue-600 w-5 h-5" />,
    default: <Info className="text-gray-500 w-5 h-5" />
  };
 
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
const response = await axios.get('http://localhost:5000/api/officer/get-Recent-Activities');
        if (response.data.success) {
          setActivities(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      }
    };
 
    fetchRecentActivities();
  }, []);
 
  const getIcon = (status = '') => {
    const key = status.toLowerCase();
    if (key.includes("resolve")) return iconMap.resolved;
    if (key.includes("progress")) return iconMap['in progress'];
    if (key.includes("assign")) return iconMap.assigned;
    return iconMap.default;
  };
 
  return (
    <div className="min-h-screen py-10 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Recent Activity</h1>
          <p className="text-gray-500 text-sm md:text-base">
            A timeline of your latest complaint actions and updates.
          </p>
        </div>
 
        <div className="space-y-6">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition"
              >
                <div className="mt-1">
                  {getIcon(activity.status)}
                </div>
 
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-800">
                    {activity.message}
                  </p>
                  <p className="text-sm text-gray-600">
                    Ticket ID: <span className="font-medium">{activity.ticketId}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {moment(activity.timestamp).fromNow()} · Role: {activity.role}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No recent activity available.</p>
          )}
        </div>
 
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-block px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default RecentActivity;