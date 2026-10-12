import {
  User,
  Phone,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  STATES,
} from "../ProfileConstants/profile-utils";

const inputClass =
  "w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white";

const selectClass =
  "w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white";

const textareaClass =
  "w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white";

const sectionClass =
  "p-6 space-y-6 bg-white rounded-lg shadow border border-blue-100";
const fieldGrid = "grid grid-cols-1 md:grid-cols-2 gap-6";

const getDownloadUrl = (url) => {
  if (!url) return "#";
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;
  return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
};


export const getTabs = ({
  edit,
  update,
  editing,
  profile,
  aadhaarVisible,
  setAadhaarVisible,
  // setPasswordVisible,
  // passwordVisible,
}) => ({

  dashboard: (
    <div className="bg-white border border-blue-100 rounded-lg shadow-sm p-6 text-center">
      <h3 className="text-2xl font-bold text-blue-800 mb-4">
        Welcome to Your Profile Dashboard
      </h3>
      <p className="text-lg text-gray-600 mb-6">
        Manage your personal information, contact details, and account settings
        all in one place.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: User,
            color: "blue",
            title: "Personal Info",
            desc: "Update your basic information",
          },
          {
            icon: Phone,
            color: "green",
            title: "Contact Details",
            desc: "Manage your contact information",
          },
          {
            icon: Lock,
            color: "purple",
            title: "Account Security",
            desc: "Secure your account settings",
          },
        ].map(({ icon: I, color, title, desc }, i) => (
          <div key={i} className="text-center">
            <div
              className={`w-16 h-16 bg-${color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}
            >
              <I className={`w-8 h-8 text-${color}-600`} />
            </div>
            <h4 className="font-semibold text-blue-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  ),
  personal: (
    <div className={sectionClass}>
      <h3 className="font-bold text-xl text-blue-800">Personal Information</h3>
      <div className={fieldGrid}>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Full Name</label>
          <input
            className={inputClass}
            placeholder="Full Name"
            value={edit.name}
            onChange={(e) => update("name", e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Gender</label>
          <select
            className={selectClass}
            value={edit.gender}
            onChange={(e) => update("gender", e.target.value)}
            disabled={!editing}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            className={inputClass}
            type="date"
            value={edit.dob}
            onChange={(e) => update("dob", e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Nationality</label>
          <input
            className={inputClass}
            placeholder="Nationality"
            value={edit.nationality}
            onChange={(e) => update("nationality", e.target.value)}
            disabled={!editing}
          />
        </div>
      </div>
    </div>
  ),
  contact: (
    <div className={sectionClass}>
      <h3 className="font-bold text-xl text-blue-800">Contact Information</h3>
      <div className={fieldGrid}>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Primary Mobile Number
          </label>
          <input
            className={inputClass}
            placeholder="Primary Mobile Number"
            value={edit.phone}
            onChange={(e) => update("phone", e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Alternate Phone
          </label>
          <input
            className={inputClass}
            placeholder="Alternate Phone"
            value={edit.alternatePhone}
            onChange={(e) => update("alternatePhone", e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Email Address
          </label>
          <input
            className={inputClass}
            type="email"
            placeholder="Email Address"
            value={edit.email}
            onChange={(e) => update("email", e.target.value)}
            disabled={!editing}
          />
        </div>
      </div>
    </div>
  ),
  address: (
    <div className={sectionClass}>
      <h3 className="font-bold text-xl text-blue-800">Address Details</h3>
      <div className={fieldGrid}>
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 font-medium text-gray-700">Full Address</label>
          <textarea
            className={textareaClass}
            placeholder="Full Address"
            value={edit.address}
            onChange={(e) => update("address", e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">City</label>
          <input
            className={inputClass}
            placeholder="City"
            value={edit.city}
            onChange={(e) => update("city", e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">District</label>
          <input
            className={inputClass}
            placeholder="District"
            value={edit.district}
            onChange={(e) => update("district", e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">State</label>
          <select
            className={selectClass}
            value={edit.state}
            onChange={(e) => update("state", e.target.value)}
            disabled={!editing}
          >
            {STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Pincode</label>
          <input
            className={inputClass}
            placeholder="Pincode"
            value={edit.pincode}
            onChange={(e) => update("pincode", e.target.value)}
            disabled={!editing}
          />
        </div>
      </div>
    </div>
  ),
  identity: (
    <div className={sectionClass}>
      <h3 className="font-bold text-xl text-blue-800">Identity Verification</h3>
      <div className={fieldGrid}>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Aadhaar</label>
          <div className="flex items-center">
            <input
              className={inputClass}
              type={aadhaarVisible ? "text" : "password"}
              value={edit.aadhaar}
              onChange={(e) => update("aadhaar", e.target.value)}
              disabled={!editing}
            />
            <button
              className="ml-2 text-sm text-blue-600 cursor-pointer"
              type="button"
              onClick={() => setAadhaarVisible(!aadhaarVisible)}
            >
              {aadhaarVisible ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Voter ID</label>
          <input
            className={inputClass}
            placeholder="Voter ID"
            value={edit.voterId}
            onChange={(e) => update("voterId", e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">PAN Number</label>
          <input
            className={inputClass}
            placeholder="PAN Number"
            value={edit.pan}
            onChange={(e) => update("pan", e.target.value)}
            disabled={!editing}
          />
        </div>
        {/* <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Password</label>
          <div className="flex items-center">
            <input
              className={inputClass}
              type={passwordVisible ? "text" : "password"}
              value={edit.visiblePassword}
              onChange={(e) => update("visiblePassword", e.target.value)}
              disabled={!editing}
            />
            <button
              className="ml-2 text-sm text-blue-600 cursor-pointer"
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div> */}
      </div>
    </div>
  ),
  account: (
    <div className={sectionClass}>
      <h3 className="font-bold text-xl text-blue-800">Account Details</h3>
      <div className={fieldGrid}>
        {/* <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Username</label>
          <input className={inputClass} value={profile.username} disabled />
        </div> */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Registration Date
          </label>
          <input
            className={inputClass}
            value={profile.registrationDate}
            disabled
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Last Login</label>
          <input
            className={inputClass}
            value={profile.lastLogin.toLocaleString()}
            disabled
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Account Status
          </label>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm inline-flex items-center w-fit min-w-0">
            <CheckCircle className="w-4 h-4 mr-1" /> {profile.accountStatus}
          </span>
        </div>
      </div>
    </div>
  ),
  documents: (
  <div className={sectionClass}>
    <h3 className="font-bold text-xl text-blue-800 mb-4">Uploaded Documents</h3>
    {[
      {
        title: "Identity Proofs",
        docs: [
          { label: "Aadhaar Card", key: "aadhaarCardUrl", field: "aadhaarCardFile" },
          { label: "Voter ID", key: "voterIdCardUrl", field: "voterIdCardFile" },
          { label: "PAN Card", key: "panCardUrl", field: "panCardFile" },
        ],
      },
      {
        title: "Address Proofs",
        docs: [
          { label: "Utility Bill", key: "utilityBillUrl", field: "utilityBillFile" },
          { label: "Bank Statement", key: "bankStatementUrl", field: "bankStatementFile" },
        ],
      },
    ].map((section, i) => (
      <div key={i} className="mb-6">
        <h4 className="font-semibold mb-2 text-blue-700">{section.title}</h4>

        {section.docs.map((doc, j) => (
          <div
            key={j}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 border border-blue-100 rounded-md mt-2 bg-white"
          >
            <span className="flex gap-2 items-center text-gray-800 min-w-0 break-words">
              <FileText className="w-4 h-4 text-blue-600" />
              {doc.label}
            </span>

            {editing ? (
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => update(doc.field, e.target.files?.[0])}
                className="text-sm text-gray-700 w-full sm:w-auto"
              />
            ) : profile?.[doc.key] ? (
              <div className="flex flex-wrap gap-3">
                <a
                  href={profile[doc.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  View
                </a>
                <a
                  href={getDownloadUrl(profile[doc.key])}
                  download
                  className="text-green-600 text-sm hover:underline"
                >
                  Download
                </a>
              </div>
            ) : (
              <span className="text-gray-400 text-sm italic">Not Uploaded</span>
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
),

});
