
import { useState } from "react";
 
export default function RegisterForm() {
  const [registerForm, setRegisterForm] = useState({
    name: "",
    gender: "",
    address: "",
    locality: "",
    state: "",
    district: "",
    pincode: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityCode: "",
  });
 
  const [captcha, setCaptcha] = useState(generateCaptcha());
 
  // Generate 6-character captcha
  function generateCaptcha() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
 
  // Handle form submit with basic captcha validation
  const handleRegister = () => {
    if (registerForm.securityCode !== captcha) {
      alert("Incorrect Security Code. Please try again.");
      return;
    }
 
    // Additional validations can be added here...
 
    console.log("Registration Data:", registerForm);
    alert("Registration Successful!");
  };
 
  return (
    <div className="space-y-4">
      
      {/* Full Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Your full name"
value={registerForm.name}
          onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
        />
      </div>
 
      {/* Gender */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <div className="flex space-x-4">
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
 
      {/* Address */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Address / Premises</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="House No. / Premises"
          value={registerForm.address}
          onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
        />
      </div>
 
      {/* Locality */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Locality</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Locality"
          value={registerForm.locality}
          onChange={(e) => setRegisterForm({ ...registerForm, locality: e.target.value })}
        />
      </div>
 
      {/* State */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">State</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={registerForm.state}
          onChange={(e) => setRegisterForm({ ...registerForm, state: e.target.value })}
        >
          <option value="">-- Select State --</option>
          <option value="Delhi">Delhi</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Other">Other</option>
        </select>
      </div>
 
      {/* District */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">District</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="District"
          value={registerForm.district}
          onChange={(e) => setRegisterForm({ ...registerForm, district: e.target.value })}
        />
      </div>
 
      {/* Pincode */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Pincode</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Pincode"
          value={registerForm.pincode}
          onChange={(e) => setRegisterForm({ ...registerForm, pincode: e.target.value })}
        />
      </div>
 
      {/* Mobile Number */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Mobile Number"
          value={registerForm.phone}
          onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
        />
      </div>
 
      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2"
placeholder="your.email@example.com"
value={registerForm.email}
          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
        />
      </div>
 
      {/* Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={registerForm.password}
          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
        />
      </div>
 
      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={registerForm.confirmPassword}
          onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
        />
      </div>
 
      {/* Security Code with Refresh */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Security Code</label>
        <div className="flex items-center space-x-4">
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
 
      {/* Submit Button */}
      <button
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleRegister}
      >
        Create Account
      </button>
    </div>
  );
}