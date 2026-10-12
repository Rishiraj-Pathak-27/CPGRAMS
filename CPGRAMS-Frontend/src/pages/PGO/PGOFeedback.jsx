import React, { useState } from "react";
// import { Textarea } from "lucide-react";

const PGOFeedback = () => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit feedback to backend API (optional)
    console.log("Feedback submitted:", feedback);

    setSubmitted(true);
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 py-20 px-6 sm:px-20 flex items-start justify-center">
      <div className="max-w-3xl w-full bg-white/60 backdrop-blur-md rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-8 border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 drop-shadow-md">
          Share Your Feedback
        </h2>

        {submitted ? (
          <div className="text-green-600 font-medium">
            Thank you for your valuable feedback!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="text-sm text-gray-700 font-medium">Your Feedback</span>
              <textarea
                rows="6"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback here..."
                required
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
              />
            </label>

            <div className="text-right mt-6">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white shadow-inner shadow-blue-300 hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PGOFeedback;
