"use client";

import {
  useState,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Search,
  faqData,
  Header,
  Footer,
} from "./FaqsConstants/faq-utils";

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const filteredFAQ = faqData
    .map((section) => ({
      ...section,
      questions: section.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((section) => section.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        setTrackModalOpen={() => {}}
        handleAuthAction={() => {}}
        isLoggedIn
        handleLogout={() => {}}
      />
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* page heading code below */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
            Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Frequently Asked Questions on Grievance Redress Mechanism in
            Government of India and the Role of Department of Administrative
            Reforms and Public Grievance, New Delhi, therein
          </p>
          <a href="/" className="flex justify-center">
            <button className="flex items-center gap-2 cursor-pointer mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold">
              <ChevronLeft />
              Back to Dashboard
            </button>
          </a>
        </div>
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for questions..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* main faqs section below */}
        <div className="space-y-4">
          {filteredFAQ.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-5 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between border-b border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {section.title}
                </h2>
                {openSections[section.id] ? (
                  <ChevronUp className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-blue-600" />
                )}
              </button>

              {/* faqs section content below */}
              {openSections[section.id] && (
                <div className="px-6 py-6 bg-white">
                  <div className="space-y-6">
                    {section.questions.map((qa, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-600 pl-4"
                      >
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                          {qa.question}
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-base">
                          {qa.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* no result message */}
        {filteredFAQ.length === 0 && searchTerm && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;
