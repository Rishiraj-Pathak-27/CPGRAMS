import { useState } from "react";
import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Footer from "../../components/footer/Footer";
import Register from "../../components/auth/Register";
import Login from "../../components/auth/Login";
//import Header from "../../components/header/MainHeader";
import HeaderLayout from "../../components/header/Header-Layout/HeaderLayout";
import Header from "../../components/header/MainHeader";
export default function Auth() {
  const [tab, setTab] = useState("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Public Grievance Portal
              </h1>
              <p className="text-xs text-gray-500">Government of India</p>
            </div>
          </div>
          <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
            Track Complaint
          </button>
        </div>
      </header> */}
      <Header/>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
                Your <span className="text-blue-600">Voice</span> Matters
              </h2>
              <p className="text-xl text-gray-600 mb-6 text-center">
                Submit your grievances securely and track their resolution
                through our transparent, government-grade platform.
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6 ">
              <div className="flex items-start space-x-3">
                <FileText className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Easy Submission
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Submit complaints with attachments and get instant token
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Real-time Tracking
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Track status updates and responses in real-time
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Guaranteed Response
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Auto-reminders ensure timely officer responses
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Escalation Support
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Automatic escalation for unresolved cases
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">15,847</div>
                <div className="text-sm text-gray-600">Complaints Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  7.2 days
                </div>
                <div className="text-sm text-gray-600">Avg. Resolution</div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Card */}
          <div className="lg:pl-8">
            <div className="w-full max-w-md mx-auto border border-gray-200 rounded-lg shadow-sm bg-white">
              <div className="text-center border-b border-gray-200 p-6">
                <h2 className="text-xl font-bold">Access Portal</h2>
                <p className="text-gray-500 mt-1">
                  Login or register to submit and track your grievances
                </p>
              </div>

              <div className="p-6">
                {/* Tab Switch */}
                <div className="flex mb-6 border border-gray-200 rounded overflow-hidden">
                  <button
                    onClick={() => setTab("login")}
                    className={`w-1/2 px-4 py-2 ${
                      tab === "login"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setTab("register")}
                    className={`w-1/2 px-4 py-2 ${
                      tab === "register"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    Register
                  </button>
                </div>

                {/* Login Form */}
                {tab === "login" && <Login />}

                {/* Register Form */}
                {tab === "register" && <Register onRegisterSuccess={() => setTab("login")} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
