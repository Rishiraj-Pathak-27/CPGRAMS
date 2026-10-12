// import react, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Auth from "./pages/auth/Auth";
import Home from "./pages/home/Home";
import GrievanceForm from "./pages/GRV-form/GrivanceForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import ForgotPasswordOTP from "./components/auth/ForgotPasswordOTP";
import ChangePassword from "./components/auth/ChangePassword";
import AuthForgotPassword from "./pages/auth/AuthForgotPassword";
import TrackGrievancePage from "./pages/Track-GRV/TrackGrievancePage";
import MyGrievances from "./pages/My-Complaints/myGrievance";
import CitizenProfile from "./components/profile/citizen-profile";
import HelpCenter from "./components/HelpCenter/help";
import Faqs from "./components/faqs/faqs";
import Team from "./pages/PGO/Team";
import PGOLayout from "./pages/PGO/PGOLayout";
import Dashboard from "./pages/PGO/Dashboard";
import RecentActivity from "./pages/PGO/components/RecentActivity";
import TokenPage from "./pages/GRV-form/TokenPage";
import Reminder from "./pages/PGO/Reminder";
import ContactSupportPage from "./components/contactSupport";
import RejisterJuniorPGO from "./pages/PGO/RejisterJuniorPGO";
import { UserProvider } from "./context/userContext";
import ProtectedRoute from "./components/ProtectedRoute";
import OfficerComplaints from "./pages/PGO/OfficerComplaints";
import PGOProfile from './pages/PGO/PGOProfile';
import PGOFeedback from "./pages/PGO/PGOFeedback";
import ComplaintDetails from "./pages/PGO/ComplaintDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import RejisterLeadOfficer from "./pages/admin/LeadOfficersDetails";
import RejisterOfficer from "./pages/admin/RejisterOfficer";
import LeadOfficersDetails from "./pages/admin/LeadOfficersDetails";

function App() {
  return (
    <>
      <Toaster position="top-right"/>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgotpassword" element={<AuthForgotPassword />} />

            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/grv" element={<GrievanceForm />} />
              <Route path="/grievance-success" element={<TokenPage />} />
              <Route path="/trk-grv" element={<TrackGrievancePage />} />
              <Route path="/myGrievance" element={<MyGrievances />} />
              <Route path="/trk-grv" element={<TrackGrievancePage />} />
              <Route path="/citizen-profile" element={<CitizenProfile />} />
              <Route path="/contact" element={<ContactSupportPage />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/faq" element={<Faqs />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['officer', 'lead_officer']} />}>
              <Route path="/PGO-Dashboard" element={<PGOLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="team" element={<Team />} />
                <Route path="ofc-com" element={<OfficerComplaints />} />
                <Route path="ofc-com/:uniqueID" element={<ComplaintDetails />} />
                <Route path="recent-activity" element={<RecentActivity />} />
                <Route path="reminder" element={<Reminder />} />
                <Route path='PGO-Rejister' element={<RejisterJuniorPGO />} />
                <Route path='PGOProfile' element={<PGOProfile />} />
                <Route path='PGOFeedback' element={<PGOFeedback />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/Admin-Dashboard" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path='RejisterLeadOfficer' element={<RejisterLeadOfficer />} />
                <Route path='RejisterOfficer' element={<RejisterOfficer />} />
                <Route path='LeadOfficerDetails' element={<LeadOfficersDetails />} />
              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
