import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/customToast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function MultiStepRegister({ onRegisterSuccess }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    district: "",
    pincode: "",
    phoneNumber: "", 
    email: "",
    password: "",
    confirmPassword: "",
    securityCode: "",
  });

  const [captcha, setCaptcha] = useState(generateCaptcha());

  function generateCaptcha() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleRegister = async () => {
    if (registerForm.securityCode !== captcha) {
      showToast("Incorrect Security Code. Please try again.", "error");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      showToast("Passwords do not match. Please try again.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: registerForm.fullName,
          gender: registerForm.gender,
          phoneNumber: registerForm.phoneNumber,
          address: registerForm.address,
          city: registerForm.city,
          state: registerForm.state,
          district: registerForm.district,
          pincode: registerForm.pincode,
          email: registerForm.email,
          password: registerForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          showToast("Registration Successful! Welcome email has been sent.", "success");
          console.log("Registration successful:", data);
          setIsSubmitting(false);
          if (onRegisterSuccess) {
            onRegisterSuccess();
          }
        }, 1000);
        return;
      } else {
        if (data.errors) {
          const errorMessages = data.errors.map(error => error.msg).join(', ');
          showToast(`Registration failed: ${errorMessages}`, "error");
        } else {
          showToast(`Registration failed: ${data.message}`, "error");
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Registration failed. Please try again.', "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 border border-gray-200 shadow-lg rounded-lg space-y-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Citizen Registration</h2>

      {/* Step Indicators */}
      <div className="flex justify-center space-x-4 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${step === s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Step 1 - Personal Info */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.fullName}
              onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="flex space-x-4 mt-1">
              {["Male", "Female", "Transgender"].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={registerForm.gender === option}
                    onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2 - Contact Details */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Address / Premises</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.address}
              onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.city}
              onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.state}
              onChange={(e) => setRegisterForm({ ...registerForm, state: e.target.value })}
            >
              <option value="">-- Select State --</option>
              <option value="Delhi">Delhi</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">District</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.district}
              onChange={(e) => setRegisterForm({ ...registerForm, district: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pincode</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.pincode}
              onChange={(e) => setRegisterForm({ ...registerForm, pincode: e.target.value })}
            />
          </div>

          <div className="flex justify-between space-x-2">
            <button onClick={prevStep} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
              Back
            </button>
            <button onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3 - Account Setup */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.phoneNumber}
              onChange={(e) => setRegisterForm({ ...registerForm, phoneNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
            />
          </div>

          {/* Security Code with Refresh */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Security Code</label>
            <div className="flex items-center space-x-4 mt-1">
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter the code"
                value={registerForm.securityCode}
                onChange={(e) => setRegisterForm({ ...registerForm, securityCode: e.target.value })}
              />
              <div className="px-3 py-2 bg-gray-100 rounded text-gray-700 font-bold min-w-[80px] text-center">
                {captcha}
              </div>
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setCaptcha(generateCaptcha())}
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="flex justify-between space-x-2">
            <button onClick={prevStep} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
              Back
            </button>
            <button 
              onClick={handleRegister} 
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}