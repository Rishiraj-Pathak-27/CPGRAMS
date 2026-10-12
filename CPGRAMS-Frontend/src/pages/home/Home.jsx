import react, { useState } from "react";
import {
  Shield,
  Users,
  FileText,
  Bell,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
// import Header from "../../components/header/header";
//import Header from "../../components/header/MainHeader";
import HeaderLayout from "../../components/header/Header-Layout/HeaderLayout";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/MainHeader";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate()

  const stats = [
    {
      label: "Grievances Resolved",
      value: "12,458",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Average Response Time",
      value: "3.2 days",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      label: "Active Complaints",
      value: "284",
      icon: FileText,
      color: "text-orange-600",
    },
    {
      label: "Satisfaction Rate",
      value: "94.6%",
      icon: MessageSquare,
      color: "text-purple-600",
    },
  ];

  const features = [
    {
      icon: FileText,
      title: "Submit Grievances",
      description:
        "Easy online form to submit your complaints with file attachments",
    },
    {
      icon: Shield,
      title: "Secure Tracking",
      description: "Track your complaint status using unique token number",
    },
    {
      icon: Bell,
      title: "Real-time Updates",
      description: "Get notified via email about status changes and responses",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated PG Officers to handle and resolve your concerns",
    },
  ];


  const handleTrackComplaint = () => {
    navigate("/trk-grv");
  };

  const handleSubmitGrievance = () => {
    navigate("/grv");
  };

  const handleGetStart = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <Header />

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-gray-200 text-gray-700 px-4 py-1 rounded mb-4">
            Government of India Initiative
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Public Grievance{" "}
            <span className="text-blue-600 block">Management System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A secure, transparent, and efficient platform for citizens to submit
            grievances and track their resolution status with dedicated
            government support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSubmitGrievance}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded"
            >
              Submit Your Grievance
            </button>
            <button
              onClick={handleTrackComplaint}
              className="border border-gray-300 px-8 py-3 text-lg rounded hover:bg-gray-50"
            >
              Track Existing Complaint
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center shadow-sm border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg mb-4 mx-auto">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our System Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive grievance management system ensures your
              concerns are heard, tracked, and resolved efficiently.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 mx-auto">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Submit Your Grievance?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of citizens who have successfully resolved their
            concerns through our platform.
          </p>
          <button
            onClick={handleGetStart}
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg rounded"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
