import React from "react";
import {
  Shield,
  Users,
  FileText,
  Bell,
  CheckCircle,
  Clock,
  UserCircle,
  MessageSquare,
} from "lucide-react";
import GrievanceList from "./components/GrievanceList";
import RecentActivity from "./components/RecentActivity";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import moment from "moment";

function Dashboard() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);


  const statusColor = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    danger: "bg-red-500",
    "In Progress": "bg-blue-500",
    Pending: "bg-yellow-500",
    Resolved: "bg-green-500",
  };

  const response = async () => {
    try {
      const data = await axios.get(
        "http://localhost:5000/api/officer/all-stats"
      );
      if (data.status == 200) {
        setStatsData(data.data);
        console.log(data.data);
      } else {
        console.log("some error occured", data.data.message);
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/officer/get-Recent-Activities"
      );
      if (res.data.success) {
        setActivities(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch activity:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token"); 

      const res = await axios.get("http://localhost:5000/api/grievances/feedbacks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setFeedbacks(res.data.feedbacks.slice(0, 3)); // only show top 3
      }
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
    }
  };



  useEffect(() => {
    response();
    fetchRecentActivity();
    fetchRecentFeedbacks();
  }, []);


  console.log("hard stats -->", statsData.inProgress);

  const stats = [
    {
      label: "Total Assigned",
      value: statsData.totalGrievances,
      icon: FileText,
      color: "text-green-600",
    },
    {
      label: "Pending Review",
      value: statsData.pendingReview,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      label: "In Progress",
      value: statsData.inProgress,
      icon: FileText,
      color: "text-orange-600",
    },
    {
      label: "Resolved ",
      value: statsData.resolved,
      icon: MessageSquare,
      color: "text-purple-600",
    },
  ];

  // const recentActivity = [
  //   {
  //     id: 1,
  //     type: "success",
  //     action: "Complaint #12345 resolved",
  //     complaint: "water issue reported by user",
  //     time: "2 hours ago"
  //   },
  //   {
  //     id: 2,
  //     type: "success",
  //     action: "Complaint #12345 resolved",
  //     complaint: "water issue reported by user",
  //     time: "2 hours ago"
  //   }]
  return (
    <>
      <section className="px-4 pt-2 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center shadow-sm border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg mb-4 mx-auto">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row  pt-6 pb-4 gap-5 ">
          <div className="w-full md:w-3/4 bg-white flex justify-center items-center rounded-lg shadow-sm border border-gray-200 mb-6 md:mb-0">
            <GrievanceList />
          </div>

          <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative">
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              <p className="text-sm text-gray-500">Your latest actions and updates</p>
            </div>




            {/* Marquee animation CSS injected */}
            <style>
              {`
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }

      .marquee {
        animation: marquee 20s linear infinite;
      }
    `}
            </style>

            <div className="relative p-4 overflow-hidden">
              {loading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : activities.length === 0 ? (
                <p className="text-sm text-gray-500">No activity found.</p>
              ) : (
                <div className="flex gap-4 w-max marquee">
                  {activities.map((activity, index) => (
                    <div
                      key={index}
                      className="min-w-[250px] max-w-xs flex-shrink-0 p-4 bg-gray-50 rounded-xl shadow-md border border-gray-200 transition hover:shadow-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2.5 h-2.5 mt-1.5 rounded-full ${statusColor[activity.status] || "bg-gray-400"
                            }`}
                        ></div>

                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium text-gray-800">
                            {activity.message || "Status updated"}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <UserCircle className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold">{activity.updatedBy}</span>
                            </span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-medium">
                              {activity.role?.replace(/_/g, " ") || "officer"}
                            </span>
                            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                              {activity.ticketId}
                            </span>
                          </div>

                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {moment(activity.timestamp).fromNow()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => navigate("recent-activity")}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition duration-200"
              >
                View More
              </button>
            </div>

            {/* Recent Feedback Section */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-2">Recent Feedback</h3>

              {feedbacks.length === 0 ? (
                <p className="text-sm text-gray-500">No feedback submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map((feedback, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-semibold text-gray-800">{feedback.user}</div>
                        <div className="text-yellow-500 font-bold text-sm">{feedback.rating} ★</div>
                      </div>
                      <div className="text-xs text-gray-600 italic truncate">
                        {feedback.message || "No comments provided."}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        {moment(feedback.submittedAt).fromNow()} &middot;{" "}
                        <span className="text-blue-600 font-medium">{feedback.uniqueID}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
