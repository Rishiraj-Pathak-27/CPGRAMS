import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import moment from "moment";
import GrievanceCard from "./GrievanceCard";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
 
const statusDot = {
  Pending: "bg-yellow-500",
  "In Progress": "bg-blue-500",
  Resolved: "bg-green-500",
};
 
const GrievanceList = () => {
  const [grievances, setGrievances] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(true);
  const containerRef = useRef(null);
  const scrollTimeout = useRef(null);
 
  useEffect(() => {
axios.get("http://localhost:5000/api/officer/get-recent-grievances")
      .then(res => {
        if (res.data.success) setGrievances(res.data.grievances);
      })
      .catch(console.error);
  }, []);
 
  useEffect(() => {
    if (!grievances.length) return;
    const interval = setInterval(() => {
      setCurrentIndex(idx => (idx + 1) % grievances.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [grievances]);
 
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const handleScroll = () => {
      setShowButtons(false);
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setShowButtons(true), 1000);
    };
    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);
 
  const handlePrev = () =>
    setCurrentIndex(idx =>
      idx === 0 ? grievances.length - 1 : idx - 1
    );
  const handleNext = () =>
    setCurrentIndex(idx => (idx + 1) % grievances.length);
 
  return (
    <div className="w-full px-4 py-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 inline-flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Recent Assigned Grievances ({grievances.length})
        </h2>
      </div>
 
      <div ref={containerRef} className="relative w-full overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${grievances.length * 100}%`,
          }}
        >
          {grievances.map(g => (
            <div key={g._id} className="w-full flex-shrink-0" style={{ width: "100%" }}>
              <div className="relative">
                <div
                  className={`absolute top-4 left-4 w-3 h-3 rounded-full ${statusDot[g.status] || "bg-gray-400"}`}
                />
                <GrievanceCard grievance={{
                  id: g.uniqueID,
                  title: g.title,
                  description: g.grievanceDescription,
                  citizen: g.fullName,
                  category: g.category,
                  submitted: moment(g.createdAt).format("YYYY-MM-DD"),
                  due: moment(g.dateOfIncident).format("YYYY-MM-DD"),
                  status: g.status,
                  priority: g.category,
                  attachmentUrl: g.attachments?.[0]?.url || null,
                  updatedAgo: moment(g.updatedAt).fromNow()
                }} />
              </div>
            </div>
          ))}
        </div>
 
        {showButtons && grievances.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-10"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-10"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>
 
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => { /* navigate to full list */ }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
        >
          View More
        </button>
      </div>
    </div>
  );
};
 
export default GrievanceList;