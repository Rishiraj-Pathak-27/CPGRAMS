import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { showToast } from "../../utils/customToast"; // 💡 import the custom toast

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const remembered = localStorage.getItem("rememberMe") === "true";
    
    if (remembered && savedEmail) {
      setLoginForm({
        email: savedEmail,
        password: "",
      });
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, loginForm);
      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      // Handle Remember Me functionality
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", loginForm.email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }

      showToast("Welcome back! Redirecting to citizen dashboard...", "success"); // 💡 Show success toast

      setTimeout(() => {
        if (data.role === "user") {
          navigate("/");
        } else if (data.role === "officer" || data.role === "lead_officer") {
          navigate("/PGO-Dashboard");
        } else if (data.role === "admin") {
          navigate("/Admin-Dashboard");
        }
      }, 1000);
    } catch (err) {
      let errorMessage = "Server error";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      showToast(errorMessage, "error"); // 💡 Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const clickForgotPassword = () => {
    navigate("/forgotpassword");
  };


  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="your.email@example.com"
          value={loginForm.email}
          onChange={(e) =>
            setLoginForm({ ...loginForm, email: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({
                ...loginForm,
                password: e.target.value,
              })
            }
          />
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <label className="flex items-center text-sm text-gray-600">
          <input 
            type="checkbox" 
            className="mr-2" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>
        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
          onClick={clickForgotPassword}
        >
          Forgot password?
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium -mt-3">{error}</p>
      )}

      <div className="space-y-3">
        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-60"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          )}
          {isLoading ? 'Logging in...' : 'Login as Citizen'}
        </button>
        {/* <Link href="/officer/dashboard">
          <button className="w-full border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
            Login as PG Officer
          </button>
        </Link>
        <Link href="/admin/dashboard">
          <button className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
            Admin Login
          </button>
        </Link> */}
      </div>
    </div>
  );
};

export default Login;



