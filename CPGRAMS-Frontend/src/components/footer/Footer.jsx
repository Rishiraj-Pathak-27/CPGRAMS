import React from 'react'
import { Shield } from "lucide-react"
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative z-20000">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">GrievancePortal</span>
          </div>
          <p className="text-gray-400">
            Empowering citizens with transparent and efficient grievance resolution.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><span className="hover:text-white cursor-pointer">Submit Grievance</span></li>
            <li><span className="hover:text-white cursor-pointer">Track Status</span></li>
            <li><span className="hover:text-white cursor-pointer">FAQ</span></li>
            <li>
              <span
                className="hover:text-white cursor-pointer"
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate("/contact");
                }}
              >
                Contact Support
              </span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Email: support@grievanceportal.gov.in</li>
            <li>Phone: 1800-XXX-XXXX</li>
            <li>Hours: 9:00 AM - 6:00 PM (Mon-Fri)</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        &copy; 2025 GrievancePortal. All rights reserved. | Government of India
      </div>
    </footer>
  );
}

export default Footer;
