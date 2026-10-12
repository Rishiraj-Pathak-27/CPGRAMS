import { useState, useEffect } from "react";
import HeaderLayout from "../../components/header/Header-Layout/HeaderLayout";
import Footer from "../../components/footer/Footer";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/MainHeader";
import axios from "axios";


export default function GrievanceForm() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [declarationChecked, setDeclarationChecked] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    district: "",
    postalCode: "",
    ministryName: "",
    ministryDepartment: "",
    publicAuthority: "",
    grievanceTitle: "",
    grievanceCategory: "",
    grievanceDepartment: "",
    grievanceLocation: "",
    grievanceDate: "",
    grievancePriority: "",
    grievanceRelief: "",
    grievanceDescription: "",
    grievanceAttachment: null,
    declaration: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser).user;
      setFormData((prev) => ({
        ...prev,
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phoneNumber || "",
        gender: userData.gender || "",
        dateOfBirth: userData.dob || "",
        addressLine1: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        district: userData.district || "",
        postalCode: userData.pincode || "",
      }));
    }
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("gender", formData.gender);
    form.append("dateOfBirth", formData.dateOfBirth);
    form.append("addressLine1", formData.addressLine1);
    form.append("addressLine2", formData.addressLine2);
    form.append("city", formData.city);
    form.append("state", formData.state);
    form.append("district", formData.district);
    form.append("postalCode", formData.postalCode);
    form.append("ministryName", formData.ministryName);
    form.append("departmentName", formData.ministryDepartment);
    form.append("publicAuthority", formData.publicAuthority);
    form.append("title", formData.grievanceTitle);
    form.append("locationOfIssue", formData.grievanceLocation);
    form.append("dateOfIncident", formData.grievanceDate);
    form.append("category", formData.grievancePriority);
    form.append("grievanceDescription", formData.grievanceDescription);

    if (formData.grievanceAttachment) {
      form.append("attachments", formData.grievanceAttachment);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/grievances/create",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 201) {
        const grievanceId = res.data.grievance.uniqueID;
        generatePDF(formData); // Optional
        alert("Grievance Submitted!");
        navigate("/grievance-success", { state: { grievanceId } });
      }
    } catch (error) {
      console.error("Error submitting grievance:", error);
      alert("Something went wrong. Please try again.");
    }
  };



  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] }); // Store File object
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };


  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  //generate pdf
  const generatePDF = (formData) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Grievance Submission Summary", 20, 20);

    const fields = Object.entries(formData);
    let y = 30;

    fields.forEach(([key, value]) => {
      if (key === "declaration") return;
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      doc.setFontSize(12);
      doc.text(`${label}: ${value || "-"}`, 20, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("grievance-summary.pdf");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
        <div className="w-full md:w-64 bg-blue-800 text-white flex flex-col items-center py-10 relative">
          <h2 className="text-3xl font-bold mb-12 text-center">Grievance Form</h2>
          <div className="relative flex flex-col items-start space-y-20 w-full px-4 md:pl-8">
            <div className="absolute top-0 bottom-0 left-12 w-1 z-0 flex flex-col justify-between h-full">
              <div className={`flex-1 ${step > 1 ? "bg-green-500" : "bg-gray-400"}`}></div>
              <div className={`flex-1 ${step > 2 ? "bg-green-500" : "bg-gray-400"}`}></div>
              <div className={`flex-1 ${step > 3 ? "bg-green-500" : "bg-gray-400"}`}></div>
              <div className={`flex-1 ${step > 4 ? "bg-green-500" : "bg-gray-400"}`}></div>
            </div>
            <StepCircle label="Declaration" active={step === 1} completed={step > 1} number={1} />
            <StepCircle label="Personal Details" active={step === 2} completed={step > 2} number={2} />
            <StepCircle label="Ministry Details" active={step === 3} completed={step > 3} number={3} />
            <StepCircle label="Grievance Details" active={step === 4} completed={step > 4} number={4} />
            <StepCircle label="Review & Submit" active={step === 5} completed={false} number={5} />
          </div>
        </div>

        <div className="flex-1 p-8 lg:p-16 bg-gradient-to-br from-blue-50 via-white to-slate-50 w-full">
          {step === 1 && (
            <div className="border-2 border-dashed shadow-xl rounded-xl border-gray-300 p-0 bg-white flex flex-col w-full">
              <div className="flex items-center gap-3 px-8 pt-8 pb-2">
                <svg className="w-8 h-8 text-black-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                </svg>
                <h2 className="text-2xl font-bold mb-6">Declaration & Terms</h2>
              </div>
              <div className="w-full px-8 pb-8">
                {/* <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-8 shadow-inner max-h-64 overflow-y-auto text-gray-700 text-base leading-relaxed"> */}
                  <strong className="text-lg text-blue-800">Terms and Conditions:</strong>
                  <ul className="list-decimal ml-8 mt-3 space-y-3">
                    <li>I hereby declare that the information provided in this grievance form is true and correct to the best of my knowledge and belief.</li>
                    <li>I understand that providing false or misleading information may result in the rejection of my grievance and/or legal action.</li>
                    <li>I authorize the concerned authorities to verify the information and documents submitted by me.</li>
                    <li>I agree to abide by the rules and procedures of the grievance redressal system.</li>
                    <li>I understand that my personal data will be used solely for the purpose of grievance resolution and will be kept confidential as per applicable laws.</li>
                    <li>I accept that the decision of the authorities regarding my grievance will be final and binding.</li>
                  </ul>
                {/* </div> */}
                <div className="flex items-start mt-8">
                  <input
                    type="checkbox"
                    id="declarationCheck"
                    checked={declarationChecked}
                    onChange={e => setDeclarationChecked(e.target.checked)}
                    className="mt-1 mr-3 accent-blue-600 w-5 h-5 border-2 border-blue-400 rounded focus:ring-2 focus:ring-blue-300"
                  />
                  <label htmlFor="declarationCheck" className="text-base text-gray-900 select-none font-medium">
                    I have read and agree to the above terms and conditions.
                  </label>
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    onClick={nextStep}
                    disabled={!declarationChecked}
                    className={`
                      ${declarationChecked ? "bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition" : "bg-gray-300 text-white cursor-not-allowed px-6 py-2 rounded hover:bg-blue-700 transition"}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="border-2 border-dashed shadow-lg rounded-md border-gray-300 p-4">
              <h2 className="text-2xl font-bold mb-6">Personal Details</h2>
              <div className="space-y-4">
                <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
                <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <div className="flex-1 mb-4">
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <InputField label="Date of Birth"  name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" />
                </div>
                <InputField label="Address Line 1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} />
                <InputField label="Address Line 2" name="addressLine2" type="text" value={formData.addressLine2} onChange={handleChange} />
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
                  <InputField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} />
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <InputField label="State" name="state" value={formData.state} onChange={handleChange} />
                  <InputField label="District" name="district" value={formData.district} onChange={handleChange} />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={nextStep} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="border-2 border-dashed shadow-lg rounded-md border-gray-300 p-4">
              <h2 className="text-2xl font-bold mb-6">Ministry Details</h2>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Ministry Name</label>
                    <select name="ministryName" value={formData.ministryName} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                      <option value="">Select Ministry</option>
                      <option value="Ministry of Education">Ministry of Education</option>
                      <option value="Ministry of Health">Ministry of Health</option>
                      <option value="Ministry of Home Affairs">Ministry of Home Affairs</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <select name="ministryDepartment" value={formData.ministryDepartment} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                      <option value="">Select Department</option>
                      <option value="Higher Education">Higher Education</option>
                      <option value="Public Health">Public Health</option>
                      <option value="Internal Security">Internal Security</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Public Authority</label>
                  <select name="publicAuthority" value={formData.publicAuthority} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                    <option value="">Select Authority</option>
                    <option value="CBSE">CBSE</option>
                    <option value="AIIMS">AIIMS</option>
                    <option value="NCRB">NCRB</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={prevStep} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 transition">
                  Back
                </button>
                <button onClick={nextStep} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                  Next
                </button>
              </div>
            </div>
          )}


          {step === 4 && (
            <div className="border-2 border-dashed shadow-lg rounded-md border-gray-300 p-4">
              <h2 className="text-2xl font-bold mb-6">Grievance Details</h2>
              <div className="space-y-4">
                <InputField label="Grievance Title" name="grievanceTitle" value={formData.grievanceTitle} onChange={handleChange} />
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <InputField label="Category" name="grievanceCategory" value={formData.grievanceCategory} onChange={handleChange} />
                  <InputField label="Department" name="grievanceDepartment" value={formData.grievanceDepartment} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Attach Supporting Document</label>
                  <input
                    type="file"
                    name="grievanceAttachment"
                    accept=".pdf,.jpg,.png,.jpeg,.docx"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                  {formData.grievanceAttachment && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected File: <strong>{formData.grievanceAttachment.name}</strong>
                    </p>
                  )}
                </div>

                <InputField label="Location of Issue" name="grievanceLocation" value={formData.grievanceLocation} onChange={handleChange} />
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <InputField label="Date of Incident" name="grievanceDate" value={formData.grievanceDate} onChange={handleChange} type="date" />
                  <div className="flex-1 mb-4">
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select name="grievancePriority" value={formData.grievancePriority} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                      <option value="">Select</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <InputField label="Relief Expected" name="grievanceRelief" value={formData.grievanceRelief} onChange={handleChange} />
                <div>
                  <label className="block text-sm font-medium mb-1">Grievance Description</label>
                  <textarea name="grievanceDescription" value={formData.grievanceDescription} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm md:text-base" />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={prevStep} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 transition">
                  Back
                </button>
                <button onClick={nextStep} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="border-2 border-dashed shadow-xl rounded-xl border-gray-300 p-6 bg-white">
              <h2 className="text-3xl font-bold mb-6 text-blue-700">Review Your Details</h2>

              {/* Personal Info */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-1 border-gray-200">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <ReviewItem label="Full Name" value={formData.fullName} />
                  <ReviewItem label="Email" value={formData.email} />
                  <ReviewItem label="Phone Number" value={formData.phone} />
                  <ReviewItem label="Gender" value={formData.gender} />
                  <ReviewItem label="Date of Birth" value={formData.dob} />
                  <ReviewItem label="Address Line 1" value={formData.address1} />
                  <ReviewItem label="Address Line 2" value={formData.address2} />
                  <ReviewItem label="City" value={formData.city} />
                  <ReviewItem label="State" value={formData.state} />
                  <ReviewItem label="District" value={formData.district} />
                  <ReviewItem label="Postal Code" value={formData.postalCode} />
                </div>
              </div>

              {/* Ministry Info */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-1 border-gray-200">Ministry Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <ReviewItem label="Ministry Name" value={formData.ministryName} />
                  <ReviewItem label="Department" value={formData.ministryDepartment} />
                  <ReviewItem label="Public Authority" value={formData.publicAuthority} />
                </div>
              </div>

              {/* Grievance Info */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-1 border-gray-200">Grievance Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <ReviewItem label="Title" value={formData.grievanceTitle} />
                  <ReviewItem label="Category" value={formData.grievanceCategory} />
                  <ReviewItem label="Department" value={formData.grievanceDepartment} />
                  <ReviewItem
                    label="Attached File"
                    value={formData.grievanceAttachment ? formData.grievanceAttachment.name : "No file attached"}
                  />
                  <ReviewItem label="Location" value={formData.grievanceLocation} />
                  <ReviewItem label="Incident Date" value={formData.grievanceDate} />
                  <ReviewItem label="Priority" value={formData.grievancePriority} />
                  <ReviewItem label="Expected Relief" value={formData.grievanceRelief} />
                  <ReviewItem label="Description" value={formData.grievanceDescription} />
                </div>
              </div>

              {/* Declaration */}
              <div className="flex items-start mt-4 bg-gray-100 p-3 rounded-md border border-gray-300">
                <input
                  type="checkbox"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleChange}
                  className="mt-1 mr-2"
                />
                <label className="text-sm text-gray-700">
                  I confirm that the above information is true and accurate to the best of my knowledge.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
                <button
                  onClick={prevStep}
                  className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 text-gray-800 transition w-full md:w-auto"
                >
                  Back
                </button>
                <button
                  disabled={!formData.declaration}
                  onClick={handleSubmit}
                  className={`${formData.declaration
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-green-300 cursor-not-allowed"
                    } text-white px-6 py-2 rounded transition w-full md:w-auto`}
                >
                  Submit
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}

// Step Progress Circle
const StepCircle = ({ label, active, number, completed }) => (
  <div className="relative flex items-center z-10">
    <div className={`z-20 w-8 h-8 flex items-center justify-center rounded-full border-2 ${completed ? "bg-green-500 border-green-500 text-white" : active ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-200 border-gray-300 text-gray-400"}`}>
      {completed ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : number}
    </div>
    <span className={`ml-4 text-base font-medium ${active ? "text-white" : "text-blue-200"}`}>{label}</span>
  </div>
);

// Input Field
const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex-1 mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} className="w-full border border-gray-300 rounded-md p-2" />
  </div>
);

// Review Field
const ReviewItem = ({ label, value }) => (
  <div className="border-b border-gray-200 py-2">
    <strong>{label}:</strong> <span className="ml-2">{value || "-"}</span>
  </div>
);
