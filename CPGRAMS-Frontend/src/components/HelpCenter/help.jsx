"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  Eye,
  Paperclip,
  Edit3,
  X,
  ChevronLeft,
} from "lucide-react";
import {
  QUICK_START_STEPS,
  USER_ACTIONS,
  Header,
  Footer,
} from "./HelpConstants/help-utils";

const HelpCenter = () => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleActionClick = (actionId) => {
    setSelectedAction(USER_ACTIONS[actionId]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAction(null);
  };

  const DetailModal = ({ action, onClose }) => {
    if (!action) return null;

    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(0px)",
        }}
      >
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{action.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-6">{action.description}</p>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Step-by-step Guide:
              </h4>
              <ol className="space-y-2">
                {action.detailedSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {action.acceptedFormats && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Accepted File Formats:
                </h4>
                <ul className="space-y-2">
                  {action.acceptedFormats.map((format, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{format}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <Header
          setTrackModalOpen={() => {}}
          handleAuthAction={() => {}}
          isLoggedIn
          handleLogout={() => {}}
        />

        {/* top welcome section code below */}
        <div
          className="relative text-white py-25 px-4"
          style={{
            backgroundColor: "#fff",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 1,
              display: "none",
            }}
          ></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">
              Welcome to Help & Support Center
            </h1>
            <p className="text-xl text-blue-700 mb-8">
              Get assistance with submitting and tracking your grievances
            </p>

            <div className="max-w-md mx-auto relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 text-gray-900 bg-white"
              />
            </div>
            <a href="/">
              <button className="mt-15 px-6 cursor-pointer py-2 bg-transparent text-blue-700 rounded-lg font-semibold shadow flex items-center justify-center mx-auto gap-2 transition-colors">
                <ChevronLeft className="w-5 h-5 text-blue-700" />
                <span>Back to Dashboard</span>
              </button>
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* 4 step quick quide */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              How to Use the System
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(QUICK_START_STEPS).map((step) => (
                <div
                  key={step.id}
                  className="bg-white border border-blue-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-300 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              What do you want to do?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(USER_ACTIONS).map(([key, action]) => {
                const IconComponent = {
                  FileText,
                  Eye,
                  Paperclip,
                  Edit3,
                }[action.icon];

                return (
                  <div
                    key={action.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => handleActionClick(key)}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-300 rounded-lg mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {action.description}
                    </p>
                    <span className="text-blue-600 text-sm font-medium hover:underline">
                      {action.buttonText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showModal && (
          <DetailModal action={selectedAction} onClose={closeModal} />
        )}
        <Footer />
      </div>
    </>
  );
};

export default HelpCenter;
