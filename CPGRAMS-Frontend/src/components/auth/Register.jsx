import { useState } from "react";
import { showToast } from "../../utils/customToast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const createCaptcha = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

export default function MultiStepRegister({ onRegisterSuccess }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState(createCaptcha());

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

  const updateField = (field, value) => {
    setRegisterForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const refreshCaptcha = () => {
    setCaptcha(createCaptcha());
    updateField("securityCode", "");
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!registerForm.fullName.trim() || !registerForm.gender) {
        showToast("Please enter your full name and select gender.", "error");
        return false;
      }
    }

    if (currentStep === 2) {
      const requiredFields = [
        ["address", "address"],
        ["city", "city"],
        ["state", "state"],
        ["district", "district"],
        ["pincode", "pincode"],
      ];

      const missingField = requiredFields.find(
        ([field]) => !registerForm[field].trim()
      );

      if (missingField) {
        showToast(
          `Please enter your ${missingField[1]} before continuing.`,
          "error"
        );
        return false;
      }

      if (!/^\d{6}$/.test(registerForm.pincode)) {
        showToast("Pincode must contain exactly 6 digits.", "error");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((previous) => Math.min(previous + 1, 3));
    }
  };

  const prevStep = () => {
    setStep((previous) => Math.max(previous - 1, 1));
  };

  const handleRegister = async () => {
    if (isSubmitting) return;

    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

    if (!/^[6-9]\d{9}$/.test(registerForm.phoneNumber.trim())) {
      showToast("Please enter a valid 10-digit mobile number.", "error");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(registerForm.email.trim())) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (registerForm.password.length < 6) {
      showToast("Password must contain at least 6 characters.", "error");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      showToast("Passwords do not match. Please try again.", "error");
      return;
    }

    if (registerForm.securityCode.trim() !== captcha) {
      showToast("Incorrect Security Code. Please try again.", "error");
      refreshCaptcha();
      return;
    }

    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          fullName: registerForm.fullName.trim(),
          gender: registerForm.gender,
          address: registerForm.address.trim(),
          city: registerForm.city.trim(),
          state: registerForm.state.trim(),
          district: registerForm.district.trim(),
          pincode: registerForm.pincode.trim(),
          phoneNumber: registerForm.phoneNumber.trim(),
          email: registerForm.email.trim().toLowerCase(),
          password: registerForm.password,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : {};

      if (!response.ok) {
        const validationErrors = Array.isArray(data.errors)
          ? data.errors
              .map((error) => error.msg || error.message)
              .filter(Boolean)
              .join(", ")
          : "";

        throw new Error(
          validationErrors ||
            data.message ||
            `Registration failed (HTTP ${response.status}).`
        );
      }

      showToast(
        data.message || "Registration successful. You can now log in.",
        "success"
      );

      if (onRegisterSuccess) {
        onRegisterSuccess(data);
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.name === "AbortError") {
        showToast(
          "The server did not respond within 15 seconds. Check that the backend is running on port 5000.",
          "error"
        );
      } else if (error instanceof TypeError) {
        showToast(
          "Cannot connect to the server. Start the backend and verify it is running on port 5000.",
          "error"
        );
      } else {
        showToast(error.message || "Registration failed. Please try again.", "error");
      }

      refreshCaptcha();
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 border border-gray-200 shadow-lg rounded-lg space-y-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Citizen Registration
      </h2>

      <div className="flex justify-center space-x-4 mb-6">
        {[1, 2, 3].map((number) => (
          <div
            key={number}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step === number
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {number}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="flex space-x-4 mt-1">
              {["Male", "Female", "Transgender"].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={registerForm.gender === option}
                    onChange={(event) => updateField("gender", event.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {[
            ["address", "Address / Premises"],
            ["city", "City"],
            ["district", "District"],
          ].map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={registerForm[field]}
                onChange={(event) => updateField(field, event.target.value)}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            <select
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.state}
              onChange={(event) => updateField("state", event.target.value)}
            >
              <option value="">-- Select State --</option>
              <option value="Delhi">Delhi</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pincode
            </label>
            <input
              required
              inputMode="numeric"
              maxLength="6"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.pincode}
              onChange={(event) =>
                updateField("pincode", event.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              required
              inputMode="numeric"
              maxLength="10"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.phoneNumber}
              onChange={(event) =>
                updateField("phoneNumber", event.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              required
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              required
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              required
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={registerForm.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Security Code
            </label>
            <div className="flex items-center space-x-4 mt-1">
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter the code"
                value={registerForm.securityCode}
                onChange={(event) =>
                  updateField("securityCode", event.target.value)
                }
              />
              <div className="px-3 py-2 bg-gray-100 rounded text-gray-700 font-bold min-w-[80px] text-center">
                {captcha}
              </div>
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={refreshCaptcha}
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleRegister}
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}