import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";

export default function Header({ setTrackModalOpen, handleAuthAction, isLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const hideAuthButtons = location.pathname.includes("/auth");

  return (
    <header className="bg-white shadow-sm border-b border-blue-100 top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">GrievancePortal</h1>
            <p className="text-xs text-gray-500">Government Services</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={() => setTrackModalOpen(true)}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 hidden lg:inline"
          >
            Track
          </button>
          {!hideAuthButtons && (
            <>
              <button
                onClick={() => handleAuthAction("login")}
                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 hidden lg:inline"
              >
                Login
              </button>
              <button
                onClick={() => handleAuthAction("register")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded hidden lg:inline"
              >
                Register
              </button>
            </>
          )}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md border-t border-gray-200">
          <nav className="flex flex-col px-4 py-4 space-y-2">
            <button
              className="border border-gray-300 px-4 py-3 rounded hover:bg-gray-50 mt-2"
              onClick={() => {
                setTrackModalOpen(true);
                setMenuOpen(false);
              }}
            >
              Track
            </button>
            {!hideAuthButtons && (
              <>
                <button
                  className="border border-gray-300 px-4 py-3 rounded hover:bg-gray-50 mt-2"
                  onClick={() => {
                    handleAuthAction("login");
                    setMenuOpen(false);
                  }}
                >
                  Login
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded mt-2"
                  onClick={() => {
                    handleAuthAction("register");
                    setMenuOpen(false);
                  }}
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}