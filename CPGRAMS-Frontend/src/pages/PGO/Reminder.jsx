import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/grievances/get-reminders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mapped = res.data.grievances.flatMap((grievance) =>
          grievance.reminders.map((reminder, index) => ({
            id: `${grievance._id}-${index}`,
            complaintId: grievance.uniqueID,
            userName: grievance.user?.fullName || "Unknown",
            title: `Reminder: ${grievance.title}`,
            description: grievance.grievanceDescription || "No description available.",
            reminderDate: reminder.timestamp,
            repeat: "One-time", // You can change this if you add repeat logic
            createdAt: reminder.timestamp,
            status: grievance.status || "Pending",
            priority:
              grievance.category === "High"
                ? "High"
                : grievance.category === "Medium"
                ? "Medium"
                : "Low",
          }))
        );

        setReminders(mapped);
        if (mapped.length > 0) {
          setSelectedReminder(mapped[0]);
        }
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    fetchReminders();
  }, []);

  const filteredReminders = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    let sorted = [...reminders].filter(
      (r) =>
        r.complaintId.toLowerCase().includes(searchLower) ||
        r.userName.toLowerCase().includes(searchLower)
    );

    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [searchTerm, sortOrder, reminders]);

  return (
    <div className="px-6 py-4 min-h-screen">
      {/* Search + Sort Bar */}
      <div className="flex flex-col md:flex-row bg-gray-200 justify-between gap-4 mb-6 p-2 rounded-xl shadow-sm border border-gray-200">
        <div className="bg-white rounded-md w-full md:w-1/2">
          <input
            type="text"
            placeholder="🔍 Search by Complaint ID or User"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full md:w-1/3">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">📅 Newest to Oldest</option>
            <option value="oldest">📅 Oldest to Newest</option>
          </select>
        </div>
      </div>

      {/* Reminders List */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {filteredReminders.map((reminder) => (
          <div
            key={reminder.id}
            onClick={() => setSelectedReminder(reminder)}
            className={`min-w-[280px] bg-white p-4 rounded-xl shadow-md border-l-4 cursor-pointer transition-all ${
              selectedReminder?.id === reminder.id ? 'border-blue-600' : 'border-yellow-500'
            }`}
          >
            <h3 className="text-md font-semibold">{reminder.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Complaint ID: <span className="text-blue-600 font-medium">#{reminder.complaintId}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">User: {reminder.userName}</p>
            <p className="text-xs text-gray-500">
              Reminder Date: {new Date(reminder.reminderDate).toLocaleString()}
            </p>

            <div className="mt-2 text-xs flex justify-between items-center">
              <span
                className={`px-2 py-1 rounded-full ${
                  reminder.priority === 'High'
                    ? 'bg-red-100 text-red-700'
                    : reminder.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {reminder.priority} Priority
              </span>
              <span className="text-yellow-700 font-medium">Status: {reminder.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Reminder Details */}
      {selectedReminder && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-blue-700 mb-3">Reminder Details</h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Complaint ID:</strong> #{selectedReminder.complaintId}
            </div>
            <div>
              <strong>User:</strong> {selectedReminder.userName}
            </div>
            <div>
              <strong>Reminder Set On:</strong>{' '}
              {new Date(selectedReminder.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Reminder Date:</strong>{' '}
              {new Date(selectedReminder.reminderDate).toLocaleString()}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <span className="text-yellow-700 font-semibold">{selectedReminder.status}</span>
            </div>
            <div>
              <strong>Priority:</strong>{' '}
              <span
                className={`font-semibold ${
                  selectedReminder.priority === 'High'
                    ? 'text-red-600'
                    : selectedReminder.priority === 'Medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                {selectedReminder.priority}
              </span>
            </div>
            <div className="col-span-2">
              <strong>User Note:</strong>
              <p className="mt-1 text-gray-600">{selectedReminder.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminder;
