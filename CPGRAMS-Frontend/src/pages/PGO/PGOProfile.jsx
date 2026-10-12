import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Building2, Calendar, MapPin } from "lucide-react";

const PGOProfile = () => {
  const [pgoData, setPgoData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setPgoData(storedUser.user);
      setForm(storedUser.user);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updated = { ...pgoData, ...form };
    localStorage.setItem("user", JSON.stringify({ user: updated }));
    setPgoData(updated);
    setEditMode(false);
  };

  const handleCancel = () => {
    setForm(pgoData);
    setEditMode(false);
  };

  if (!pgoData) {
    return <div className="p-6 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 py-20 px-6 sm:px-20 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white/60 backdrop-blur-md rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-8 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 drop-shadow-md">
            PG Officer Profile
          </h2>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white shadow-inner shadow-blue-300 hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
          <InfoBlock icon={<User />} label="Full Name" name="fullName" value={form.fullName} editMode={editMode} onChange={handleChange} />
          <InfoBlock icon={<Mail />} label="Email" name="email" value={form.email} editMode={editMode} onChange={handleChange} />
          <InfoBlock icon={<Phone />} label="Phone Number" name="phoneNumber" value={form.phoneNumber} editMode={editMode} onChange={handleChange} />
          <InfoBlock icon={<Building2 />} label="Designation" name="designation" value={form.designation || "PG Officer"} editMode={editMode} onChange={handleChange} />
          <InfoBlock icon={<MapPin />} label="Location" name="location" value={form.location || "N/A"} editMode={editMode} onChange={handleChange} />
          <InfoBlock icon={<Calendar />} label="Joining Date" name="joiningDate" type="date" value={form.joiningDate ? new Date(form.joiningDate).toISOString().split("T")[0] : ""} editMode={editMode} onChange={handleChange} />

          <div className="flex items-center gap-3 col-span-1 sm:col-span-2">
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-base font-medium text-gray-800 capitalize">{pgoData.role}</p>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="mt-8 text-right flex gap-4 justify-end">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-lg bg-gray-300 text-gray-800 shadow-inner hover:bg-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg bg-green-600 text-white shadow-inner shadow-green-300 hover:bg-green-700 hover:shadow-lg transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoBlock = ({ icon, label, name, value, editMode, onChange, type = "text" }) => (
  <div className="flex items-center gap-3">
    {React.cloneElement(icon, { className: "w-5 h-5 text-blue-600" })}
    <div className="w-full">
      <p className="text-sm text-gray-500">{label}</p>
      {editMode ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      ) : (
        <p className="text-base font-medium text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

export default PGOProfile;
