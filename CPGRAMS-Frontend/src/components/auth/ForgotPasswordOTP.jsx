import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChangePassword from "./ChangePassword";
import { showToast } from "../../utils/customToast";
 
const ForgotPasswordOTP = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
 
  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
 
  // Countdown timer logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);
 
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
 
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);
 
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
 
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const newOtp = [...otpValues];
      newOtp[index - 1] = "";
      setOtpValues(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpValues.join("");
 
    if (otp.length !== 6) {
      showToast("Please enter 6-digit OTP", "error");
      return;
    }
 
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-forgot-password", {
        otp,
      });
 
      if (response.status === 200) {
        showToast("OTP verified successfully!", "success");
        setShowChangePassword(true);
      }
    } catch (error) {
      console.error("OTP verification failed:", error.response?.data?.message || error.message);
      const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleResendOTP = async () => {
    if (!canResend) return;
 
    setIsResending(true);
    try {
      const email = localStorage.getItem("email");
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      showToast("OTP resent successfully!", "success");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsResending(false);
    }
    
    setOtpValues(["", "", "", "", "", ""]);
    setTimer(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };
 
  return (
    <>
      {!showChangePassword && (
        <div className="bg-white px-6 py-6 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-14">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>We have sent a code to your email</p>
              </div>
            </div>
 
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center space-y-6">
                <div className="flex flex-row justify-between gap-2 mx-auto">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={otpValues[index]}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>
 
                <button
                  type="submit"
                  className="w-[300px] bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  {isLoading ? 'Verifying...' : 'Submit'}
                </button>
 
                <div className="flex flex-row items-center justify-center text-sm font-medium space-x-1 text-gray-500">
                  {canResend ? (
                    <>
                      <p>Didn't receive code?</p>
                      <button
                        type="button"
                        className="text-blue-600 flex items-center gap-1 disabled:opacity-50"
                        onClick={handleResendOTP}
                        disabled={isResending}
                      >
                        {isResending && (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                        )}
                        {isResending ? 'Sending...' : 'Resend OTP'}
                      </button>
                    </>
                  ) : (
                    <p>Resend OTP in {timer}s</p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
 
      {showChangePassword && <ChangePassword />}
    </>
  );
};
 
export default ForgotPasswordOTP;
 