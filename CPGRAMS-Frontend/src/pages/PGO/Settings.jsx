import React, { useState, useContext } from "react";
import { Eye, EyeOff, Edit } from "react-feather"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("Profile Settings");
  const [profileImage, setProfileImage] = useState("");

  // States to toggle password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle file change (upload new image)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save button click, show the modal
  const handleSave = () => {
    // Here you can add your save logic, e.g., making an API call
    console.log("Form data to be saved:", formData);

    const fullname = `${formData.firstName} ${formData.middleName} ${formData.lastName}`;

    try {
      const token = localStorage.getItem("token");
      const response = fetch(`${baseUrl}/admin/update-admin-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullname,
          phoneNo: formData.phoneNumber,
          adminId: user.id,
        }),
      });

      setIsModalOpen(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving form data:", error);
      alert("Error saving form data. Please try again.");
    }
  };

  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Handle input change to update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fullName = "Harshit";

//   const { user, setUser } = useContext(UserContext);

//   console.log("User data from here:", user);

  const breakName = (fullName) => {
    const nameArray = fullName.split(" ");
    if (nameArray.length === 1) {
      return { firstName: nameArray[0], lastName: "" };
    } else if (nameArray.length === 2) {
      return { firstName: nameArray[0], lastName: nameArray[1] };
    } else if (nameArray.length === 3) {
      return {
        firstName: nameArray[0],
        middleName: nameArray[1],
        lastName: nameArray[2],
      };
    }
  };

  const nameBreak = breakName(fullName);

  const [formData, setFormData] = useState({
    firstName: nameBreak.firstName,
    middleName: nameBreak.middleName,
    lastName: nameBreak.lastName,
    // email: user.email,
    // phoneNumber: user.phone_number,
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 p-6 gap-5 h-[100px]">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md mb-6 md:mb-0 ">
        {" "}
        {/* Set fixed height */}
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <button className="text-blue-500 text-sm mt-2">
            {/* File input button */}
            <label htmlFor="upload" className="cursor-pointer">
              Update Picture
            </label>
            <input
              type="file"
              id="upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </button>
          <h2 className="mt-2 text-lg font-semibold">{fullName}</h2>
          <p className="text-gray-500">Admin</p>
        </div>
        {/* Column 1: First Name and Last Name */}
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-gray-600 font-semibold">First Name</h3>
            <p className="text-gray-800">{nameBreak.firstName}</p>
          </div>
          <hr className="border-gray-300" />
          <div>
            <h3 className="text-gray-600 font-semibold">Last Name</h3>
            <p className="text-gray-800">{nameBreak.lastName}</p>
          </div>
          <hr className="border-gray-300" />

          {/* Column 2: Email Address and Phone Number */}
          <div>
            <h3 className="text-gray-600 font-semibold">Email Address</h3>
            <p className="text-gray-800">{fullName}</p>
          </div>
          <hr className="border-gray-300" />
          <div>
            <h3 className="text-gray-600 font-semibold">Phone Number</h3>
            <p className="text-gray-800">+91{fullName}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md h-[600px] relative">
        {" "}
        {/* Set fixed height */}
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <div className="mt-4 flex flex-wrap border-b">
          {["Profile Settings"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 font-semibold text-gray-500 mr-6 ${
                activeTab === tab
                  ? "border-b-2 border-[#F2A600] text-blue-500"
                  : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Pencil Icon for Edit */}
        <div
          className="absolute top-4 right-4 cursor-pointer text-gray-500"
          onClick={() => setIsEditing(!isEditing)} // Toggle edit mode on click
        >
          <Edit />
        </div>
        {activeTab === "Profile Settings" && (
          <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-600 text-sm">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md mt-1"
                  disabled={!isEditing} // Disable the input if not in edit mode
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm">Middle Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md mt-1"
                  disabled={!isEditing} // Disable the input if not in edit mode
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md mt-1"
                  disabled={!isEditing} // Disable the input if not in edit mode
                />
              </div>
              <div className="col-span-3">
                <label className="text-gray-600 text-sm">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md mt-1"
                  disabled={true}
                />
              </div>
              <div className="col-span-3">
                <label className="text-gray-600 text-sm">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    className="border p-2 rounded-md"
                    disabled={!isEditing}
                  >
                    <option>+91</option>
                  </select>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    disabled={!isEditing} // Disable the input if not in edit mode
                  />
                </div>
              </div>
            </div>

            <hr className="mt-6" />

            {isEditing && (
              <div className="mt-6 text-right">
                <button
                  className="bg-[#F2A600] text-white px-4 py-2 rounded-md"
                  onClick={handleSave} // Handle the save button click
                >
                  Save
                </button>
              </div>
            )}

            {/* <div className="mt-6">
              <h1 className="text-xl font-semibold">Register A New Admin</h1>
              <button
                  className="bg-[#F2A600] mt-3 text-white px-4 py-2 rounded-md"
                  onClick={() => navigate("/register")} 
                >
                  Register Admin
                </button>
            </div> */}
          </>
        )}
      </div>

      {/* Modal for Success */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-center">
              Profile Information Updated Successfully
            </h3>
            <div className="mt-4 flex justify-center">
              <button
                className="bg-[#F2A600] text-white px-4 py-2 rounded-md"
                onClick={closeModal} // Close the modal
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
