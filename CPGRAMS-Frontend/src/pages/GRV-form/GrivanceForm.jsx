import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import Header from "../../components/header/MainHeader";
import Footer from "../../components/footer/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function GrievanceForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser);
      const userData = parsedUser.user || parsedUser || {};

      setFormData((previous) => ({
        ...previous,
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
    } catch (error) {
      console.error("Could not load logged-in user details:", error);
    }
  }, []);

  const handleChange = (event) => {
    const { name, type, value, checked, files } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "file"
          ? files?.[0] || null
          : type === "checkbox"
            ? checked
            : value,
    }));
  };

  const nextStep = () => {
    setStep((previous) => Math.min(previous + 1, 5));
  };

  const prevStep = () => {
    setStep((previous) => Math.max(previous - 1, 1));
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Grievance Submission Summary", 20, 20);

    const details = {
      "Full Name": data.fullName,
      Email: data.email,
      Phone: data.phone,
      Gender: data.gender,
      "Date of Birth": data.dateOfBirth,
      Address: data.addressLine1,
      City: data.city,
      State: data.state,
      District: data.district,
      Pincode: data.postalCode,
      Ministry: data.ministryName,
      "Ministry Department": data.ministryDepartment,
      "Public Authority": data.publicAuthority,
      "Grievance Title": data.grievanceTitle,
      Category: data.grievanceCategory,
      "Grievance Department": data.grievanceDepartment,
      "Location of Issue": data.grievanceLocation,
      "Date of Incident": data.grievanceDate,
      Priority: data.grievancePriority,
      "Relief Expected": data.grievanceRelief,
      Description: data.grievanceDescription,
    };

    let y = 30;

    Object.entries(details).forEach(([label, value]) => {
      doc.setFontSize(11);
      doc.text(`${label}: ${value || "-"}`, 20, y);
      y += 8;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("grievance-summary.pdf");
  };

  const handleSubmit = async () => {
    if (!formData.declaration) {
      alert("Please confirm the declaration before submitting.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please log in again.");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

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
    form.append("category", formData.grievanceCategory);
    form.append("grievanceDepartment", formData.grievanceDepartment);
    form.append("locationOfIssue", formData.grievanceLocation);
    form.append("dateOfIncident", formData.grievanceDate);
    form.append("priority", formData.grievancePriority);
    form.append("reliefExpected", formData.grievanceRelief);
    form.append("grievanceDescription", formData.grievanceDescription);

    if (formData.grievanceAttachment) {
      form.append("attachments", formData.grievanceAttachment);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/grievances/create`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        generatePDF(formData);

        navigate("/grievance-success", {
          state: {
            grievanceId: response.data?.grievance?.uniqueID,
          },
        });
      }
    } catch (error) {
      console.error("Error submitting grievance:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while submitting the grievance."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
        <aside className="w-full md:w-64 bg-blue-800 text-white py-10">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Grievance Form
          </h2>

          <div className="relative min-h-[540px] flex flex-col justify-between w-full px-4 md:pl-8">
            {/* Visible light-blue progress track */}
            <div className="absolute left-12 top-4 bottom-4 w-1 rounded-full bg-blue-300 z-0" />

            {/* Green completed portion of progress */}
            <div
              className="absolute left-12 top-4 w-1 rounded-full bg-green-400 z-0 transition-all duration-500"
              style={{
                height: `${((step - 1) / 4) * 100}%`,
              }}
            />

            <StepCircle
              label="Declaration"
              active={step === 1}
              completed={step > 1}
              number={1}
            />
            <StepCircle
              label="Personal Details"
              active={step === 2}
              completed={step > 2}
              number={2}
            />
            <StepCircle
              label="Ministry Details"
              active={step === 3}
              completed={step > 3}
              number={3}
            />
            <StepCircle
              label="Grievance Details"
              active={step === 4}
              completed={step > 4}
              number={4}
            />
            <StepCircle
              label="Review & Submit"
              active={step === 5}
              completed={false}
              number={5}
            />
          </div>
        </aside>

        <main className="flex-1 p-8 lg:p-16 bg-gradient-to-br from-blue-50 via-white to-slate-50">
          {step === 1 && (
            <section className="border-2 border-dashed shadow-xl rounded-xl border-gray-300 bg-white p-8">
              <h2 className="text-2xl font-bold mb-6">
                Declaration & Terms
              </h2>

              <strong className="text-lg text-blue-800">
                Terms and Conditions:
              </strong>

              <ul className="list-decimal ml-8 mt-3 space-y-3">
                <li>I declare that the information provided is true and correct.</li>
                <li>I understand false information may result in rejection or legal action.</li>
                <li>I authorize authorities to verify submitted details.</li>
                <li>I agree to the grievance redressal procedures.</li>
                <li>My data will only be used for grievance resolution.</li>
                <li>I accept that authority decisions are final and binding.</li>
              </ul>

              <div className="flex items-start mt-8">
                <input
                  type="checkbox"
                  id="declarationCheck"
                  checked={declarationChecked}
                  onChange={(event) => {
                    setDeclarationChecked(event.target.checked);
                    setFormData((previous) => ({
                      ...previous,
                      declaration: event.target.checked,
                    }));
                  }}
                  className="mt-1 mr-3 accent-blue-600 w-5 h-5"
                />

                <label htmlFor="declarationCheck" className="text-base font-medium">
                  I have read and agree to the above terms and conditions.
                </label>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!declarationChecked}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="border-2 border-dashed shadow-lg rounded-md border-gray-300 bg-white p-6">
              <h2 className="text-2xl font-bold mb-6">Personal Details</h2>

              <div className="space-y-4">
                <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />

                <div className="flex flex-col md:flex-row md:space-x-4">
                  <SelectField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={["Male", "Female", "Transgender"]}
                  />

                  <InputField
                    label="Date of Birth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    type="date"
                  />
                </div>

                <InputField label="Address Line 1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} />
                <InputField label="Address Line 2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />

                <div className="flex flex-col md:flex-row md:space-x-4">
                  <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
                  <InputField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} />
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4">
                  <InputField label="State" name="state" value={formData.state} onChange={handleChange} />
                  <InputField label="District" name="district" value={formData.district} onChange={handleChange} />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button type="button" onClick={prevStep} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">
                  Back
                </button>
                <button type="button" onClick={nextStep} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  Next
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="border-2 border-dashed shadow-lg rounded-md border-gray-300 bg-white p-6">
              <h2 className="text-2xl font-bold mb-6">Ministry Details</h2>

              <SelectField
                label="Ministry Name"
                name="ministryName"
                value={formData.ministryName}
                onChange={handleChange}
                options={[
                  "Ministry of Education",
                  "Ministry of Health",
                  "Ministry of Home Affairs",
                ]}
              />

              <SelectField
                label="Department"
                name="ministryDepartment"
                value={formData.ministryDepartment}
                onChange={handleChange}
                options={[
                  "Higher Education",
                  "Public Health",
                  "Internal Security",
                ]}
              />

              <SelectField
                label="Public Authority"
                name="publicAuthority"
                value={formData.publicAuthority}
                onChange={handleChange}
                options={["CBSE", "AIIMS", "NCRB"]}
              />

              <div className="mt-6 flex justify-between">
                <button type="button" onClick={prevStep} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">
                  Back
                </button>
                <button type="button" onClick={nextStep} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  Next
                </button>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="border-2 border-dashed shadow-lg rounded-md border-gray-300 bg-white p-6">
              <h2 className="text-2xl font-bold mb-6">Grievance Details</h2>

              <div className="space-y-4">
                <InputField label="Grievance Title" name="grievanceTitle" value={formData.grievanceTitle} onChange={handleChange} />
                <InputField label="Category" name="grievanceCategory" value={formData.grievanceCategory} onChange={handleChange} />
                <InputField label="Department" name="grievanceDepartment" value={formData.grievanceDepartment} onChange={handleChange} />

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Attach Supporting Document
                  </label>
                  <input
                    type="file"
                    name="grievanceAttachment"
                    accept=".pdf,.jpg,.png,.jpeg,.docx"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <InputField label="Location of Issue" name="grievanceLocation" value={formData.grievanceLocation} onChange={handleChange} />

                <div className="flex flex-col md:flex-row md:space-x-4">
                  <InputField
                    label="Date of Incident"
                    name="grievanceDate"
                    value={formData.grievanceDate}
                    onChange={handleChange}
                    type="date"
                  />

                  <SelectField
                    label="Priority"
                    name="grievancePriority"
                    value={formData.grievancePriority}
                    onChange={handleChange}
                    options={["Low", "Medium", "High"]}
                  />
                </div>

                <InputField label="Relief Expected" name="grievanceRelief" value={formData.grievanceRelief} onChange={handleChange} />

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Grievance Description
                  </label>
                  <textarea
                    name="grievanceDescription"
                    value={formData.grievanceDescription}
                    onChange={handleChange}
                    rows="5"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button type="button" onClick={prevStep} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">
                  Back
                </button>
                <button type="button" onClick={nextStep} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  Next
                </button>
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="border-2 border-dashed shadow-xl rounded-xl border-gray-300 bg-white p-6">
              <h2 className="text-3xl font-bold mb-6 text-blue-700">
                Review Your Details
              </h2>

              <ReviewSection title="Personal Information">
                <ReviewItem label="Full Name" value={formData.fullName} />
                <ReviewItem label="Email" value={formData.email} />
                <ReviewItem label="Phone Number" value={formData.phone} />
                <ReviewItem label="Gender" value={formData.gender} />
                <ReviewItem label="Date of Birth" value={formData.dateOfBirth} />
                <ReviewItem label="Address Line 1" value={formData.addressLine1} />
                <ReviewItem label="Address Line 2" value={formData.addressLine2} />
                <ReviewItem label="City" value={formData.city} />
                <ReviewItem label="State" value={formData.state} />
                <ReviewItem label="District" value={formData.district} />
                <ReviewItem label="Postal Code" value={formData.postalCode} />
              </ReviewSection>

              <ReviewSection title="Ministry Details">
                <ReviewItem label="Ministry Name" value={formData.ministryName} />
                <ReviewItem label="Department" value={formData.ministryDepartment} />
                <ReviewItem label="Public Authority" value={formData.publicAuthority} />
              </ReviewSection>

              <ReviewSection title="Grievance Details">
                <ReviewItem label="Title" value={formData.grievanceTitle} />
                <ReviewItem label="Category" value={formData.grievanceCategory} />
                <ReviewItem label="Department" value={formData.grievanceDepartment} />
                <ReviewItem label="Location" value={formData.grievanceLocation} />
                <ReviewItem label="Incident Date" value={formData.grievanceDate} />
                <ReviewItem label="Priority" value={formData.grievancePriority} />
                <ReviewItem label="Expected Relief" value={formData.grievanceRelief} />
                <ReviewItem label="Description" value={formData.grievanceDescription} />
                <ReviewItem
                  label="Attached File"
                  value={formData.grievanceAttachment?.name || "No file attached"}
                />
              </ReviewSection>

              <div className="flex items-start mt-4 bg-gray-100 p-3 rounded-md border border-gray-300">
                <input
                  type="checkbox"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleChange}
                  className="mt-1 mr-2"
                />
                <label className="text-sm text-gray-700">
                  I confirm that the above information is true and accurate.
                </label>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={!formData.declaration || isSubmitting}
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}

const StepCircle = ({ label, active, number, completed }) => (
  <div className="relative z-10 flex items-center">
    <div
      className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
        completed
          ? "bg-green-500 border-green-500 text-white"
          : active
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-gray-200 border-gray-300 text-gray-400"
      }`}
    >
      {completed ? "✓" : number}
    </div>

    <span
      className={`ml-4 text-base font-medium ${
        active ? "text-white" : "text-blue-200"
      }`}
    >
      {label}
    </span>
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex-1 mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md p-2"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex-1 mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md p-2"
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const ReviewSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-1">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
      {children}
    </div>
  </div>
);

const ReviewItem = ({ label, value }) => (
  <div className="border-b border-gray-200 py-2">
    <strong>{label}:</strong> <span className="ml-2">{value || "-"}</span>
  </div>
);