import { LogIn, BookCopy, TrainTrack, Mail } from "lucide-react";
import Header from "../../header/MainHeader";
import Footer from "../../footer/Footer";

export const QUICK_START_STEPS = {
  login: {
    id: "login",
    title: "Login / Register",
    icon: <LogIn />,
    description:
      "Access your account or create a new one using your email or mobile number",
  },
  submit: {
    id: "submit",
    title: "Submit Grievance",
    icon: <BookCopy />,
    description:
      "Fill the grievance form with proper details and attach documents if needed",
  },
  track: {
    id: "track",
    title: "Track Status",
    icon: <TrainTrack />,
    description:
      "Monitor your grievance progress using the Track Complaint in your dashboard",
  },
  resolution: {
    id: "resolution",
    title: "Get Resolution",
    icon: <Mail />,
    description:
      "Receive updates via SMS/email. Authorities respond within the given timeframe",
  },
};

export const USER_ACTIONS = {
  fileGrievance: {
    id: "file-grievance",
    title: "File a Grievance",
    icon: "FileText",
    description: "Submit a new complaint with all required details",
    buttonText: "Start filing →",
    detailedSteps: [
      "Go to the official grievance portal and log in.",
      "Click on “Add Grievance” from the dashboard.",
      "Fill out the form with correct details.",
      "Upload any documents if needed.",
      "Review and submit your complaint.",
      "Note the grievance ID shown after submission.",
      "Use this ID to track or edit your grievance later.",
    ],
  },
  checkStatus: {
    id: "check-status",
    title: "Check Status",
    icon: "Eye",
    description: "Track your grievance and see current progress",
    buttonText: "View status →",
    detailedSteps: [
      "Open the grievance redressal website.",
      "Click on the “Track Complaints” section on the dashboard.",
      "Type your Grievance ID.",
      "Click the “Submit” button to see the status.",
      "Check what stage your complaint is in or any updates from the department.",
      "If it’s resolved, you will see the final response or solution.",
      "If you have questions, contact support using the given details.",
      "Save your Grievance ID – you’ll need it again later.",
    ],
  },
  attachDocuments: {
    id: "attach-documents",
    title: "Attach Documents",
    icon: "Paperclip",
    description: "Upload supporting files (PDF, JPG, PNG up to 5MB)",
    buttonText: "Learn how →",
    detailedSteps: [
      "Click on the “Attach Documents” or “Browse” button.",
      "Choose a file from your device (PDF, JPG, or PNG only).",
      "Ensure the file size is not more than 5MB.",
      "Click “Open” to attach the selected file.",
      "Confirm the document is uploaded successfully before submitting.",
    ],
    acceptedFormats: [
      "PDF - For text documents, certificates",
      "JPG/JPEG - For photographs, scanned images",
      "PNG - For screenshots, images with transparency",
    ],
  },
  editGrievance: {
    id: "edit-grievance",
    title: "Made a Mistake?",
    icon: "Edit3",
    description: "Learn how to edit or resubmit your grievance",
    buttonText: "Get help →",
    detailedSteps: [
      "Log in to your account on the portal.",
      'Go to the "MyComplaints" section on Dashboard.',
      "Find the grievance you want to edit.",
      "Click the “Edit” or “Resubmit” button (if available).",
      "Make the necessary changes or corrections.",
      "Recheck all details carefully.",
      "Click “Submit” to update your grievance.",
    ],
  },
};

export { Header, Footer };
