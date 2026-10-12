import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header/MainHeader";
import Footer from "../../components/footer/Footer";

export default function TokenPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const grievanceId = location.state?.grievanceId || "N/A";
    const [copied, setCopied] = React.useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(grievanceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans px-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col items-center p-10 text-center border border-blue-100">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-200 to-green-400 text-green-700 rounded-full flex items-center justify-center mb-8 shadow-lg animate-bounce-slow">
                        <svg
                            className="w-14 h-14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight">Thank You!</h1>
                    <p className="text-lg text-gray-600 mb-6">Your grievance has been submitted successfully.</p>

                    <div className="w-full bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow-inner px-6 py-5 mb-6 flex flex-col items-center border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1 font-semibold uppercase tracking-wider">Your Grievance Token No.</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-blue-900 tracking-widest select-all">{grievanceId}</span>
                            <button
                                onClick={handleCopy}
                                className="ml-2 px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold border border-blue-200 transition"
                                title="Copy Token"
                            >
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="mt-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white text-base font-bold shadow-lg transition-all duration-200"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}
