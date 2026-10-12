import React, { useState } from "react";
import ForgotPasswordOTP from "./ForgotPasswordOTP";
import axios from 'axios'
import { showToast } from "../../utils/customToast";

export default function ForgotPassword() {
    const [showOTP, setShowOTP] = useState(false);
    const [email,setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password',{email});
            console.log("Response-->",response);
            
            if (response.status == 200){
                 localStorage.setItem("email", email);
                setShowOTP(true);
                showToast("Password reset OTP sent to email. Please verify.", "success");
                
            }
        } catch (error) {
            console.log("something Went Wrong ",error);
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            showToast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
        // setShowOTP(true);
    };

    return (
        <>
            {!showOTP && (
                <div className="flex justify-center items-center">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-full">
                        <h2 className="text-2xl font-semibold text-center mb-6">Enter Your Email</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                )}
                                {isLoading ? 'Sending OTP...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showOTP && <ForgotPasswordOTP />}
        </>
    );
}
