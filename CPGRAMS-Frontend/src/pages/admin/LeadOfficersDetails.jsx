import React, { useState } from "react";
import { Eye, ArrowUp, Search } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";


const LeadOfficersDetails = () => {
  const employeesData = [
    { name: "John Doe", email: "john@example.com", number: "9876543210", gender: "Male", department: "Development", location: "Mumbai" },
    { name: "Jane Smith", email: "jane@example.com", number: "9876501234", gender: "Female", department: "Design", location: "Delhi" },
    { name: "Amit Verma", email: "amit.verma@example.com", number: "9123456780", gender: "Male", department: "HR", location: "Bangalore" },
    { name: "Priya Kapoor", email: "priya.k@example.com", number: "9823456710", gender: "Female", department: "Finance", location: "Pune" },
    { name: "Rahul Mehta", email: "rahul.mehta@example.com", number: "9987654321", gender: "Male", department: "Development", location: "Chennai" },
    { name: "Sneha Rani", email: "sneha.r@example.com", number: "9912345678", gender: "Female", department: "Support", location: "Hyderabad" },
    { name: "Vikram Chauhan", email: "vikram.c@example.com", number: "9876123450", gender: "Male", department: "Marketing", location: "Kolkata" },
    { name: "Anjali Sharma", email: "anjali.sharma@example.com", number: "9765432109", gender: "Female", department: "Design", location: "Ahmedabad" },
    { name: "Rohit Singh", email: "rohit.singh@example.com", number: "9654321098", gender: "Male", department: "Operations", location: "Jaipur" },
    { name: "Kavya Iyer", email: "kavya.iyer@example.com", number: "9543210987", gender: "Female", department: "Admin", location: "Lucknow" },
    { name: "Suresh Patil", email: "suresh.p@example.com", number: "9898989898", gender: "Male", department: "Support", location: "Nagpur" },
    { name: "Neha Kaur", email: "neha.kaur@example.com", number: "9797979797", gender: "Female", department: "HR", location: "Indore" },
  ];

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const locations = [...new Set(employeesData.map((emp) => emp.location))];

  const filteredEmployees = employeesData
    .filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((emp) => (locationFilter ? emp.location === locationFilter : true))
    .sort((a, b) => {
      return sortOrder === "new"
        ? employeesData.indexOf(a) - employeesData.indexOf(b)
        : employeesData.indexOf(b) - employeesData.indexOf(a);
    });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);

  return (
    <div className="overflow-x-auto py-6 px-3">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        <div className="relative w-full sm:w-2/3">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2 w-full rounded-xl outline-none ring-2 ring-blue-400 border-blue-400 transition"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          className="px-4 py-2 rounded-xl w-full sm:w-1/4 outline-none ring-2 ring-blue-400 border-blue-400 transition"
          value={locationFilter}
          onChange={(e) => {
            setLocationFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Locations</option>
          {locations.map((loc, index) => (
            <option key={index} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 rounded-xl w-full sm:w-1/4 outline-none ring-2 ring-blue-400 border-blue-400 transition"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="new">New → Old</option>
          <option value="old">Old → New</option>
        </select>
      </div>

      <table className="min-w-full shadow-[0px_0px_10px_2px_rgba(59,_130,_246,_0.5)] rounded-lg border-2 border-white overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
          <tr>
            <th className="px-6 py-4 border-b text-left text-gray-700 font-medium w-1/7">Name</th>
            <th className="px-6 py-4 border-b text-left text-gray-700 font-medium w-1/7">Email</th>
            <th className="px-6 py-4 border-b text-left text-gray-700 font-medium w-1/7">Number</th>
            <th className="px-6 py-4 border-b text-left text-gray-700 font-medium w-1/7">Gender</th>
            <th className="px-6 py-4 border-b text-left text-gray-700 font-medium w-1/7">Department</th>
            <th className="px-6 py-4 border-b text-left text-gray-700 font-medium w-1/7">Location</th>
            <th className="px-6 py-4 border-b text-center text-gray-700 font-medium w-1/7">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.length > 0 ? (
            currentEmployees.map((emp, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50 cursor-default hover:bg-blue-50 transition">
                <td className="px-3 py-2 border-b">{emp.name}</td>
                <td className="px-3 py-2 border-b">{emp.email}</td>
                <td className="px-3 py-2 border-b">{emp.number}</td>
                <td className="px-3 py-2 border-b">{emp.gender}</td>
                <td className="px-3 py-2 border-b">{emp.department}</td>
                <td className="px-3 py-2 border-b">{emp.location}</td>
                <td className="px-3 py-2 border-b">
                  <div className="flex items-center justify-center gap-3">
                    <button className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
                      <ArrowUp size={16} /> Promote
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
                      <Eye size={16} /> View
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {filteredEmployees.length > entriesPerPage && (

        <div className="flex justify-center items-center mt-6 space-x-6">
          <button
            className="w-[100px] py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="px-5 py-2 bg-gray-100 text-gray-800 rounded-lg shadow-sm font-medium">
            Page <span className="text-blue-600 font-semibold">{currentPage}</span> / {totalPages}
          </span>

          <button
            className="w-[100px] py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>


      )}
    </div>
  );
};

export default LeadOfficersDetails;
