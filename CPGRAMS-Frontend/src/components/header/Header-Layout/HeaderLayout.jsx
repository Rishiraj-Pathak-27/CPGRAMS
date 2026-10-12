import { useState } from "react";
import Header from "../MainHeader";
 
export default function HeaderLayout() {
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");
 
  // Simulate login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  const handleAuthAction = (type) => {
    setAuthType(type);
    setAuthModalOpen(true);
  };
 
  return (
    <>
      <Header
        setTrackModalOpen={setTrackModalOpen}
        handleAuthAction={handleAuthAction}
        isLoggedIn={isLoggedIn}
      />
 
      <div >
        <button
          className=" bg-blue-600 text-white rounded"
          onClick={() => setIsLoggedIn(!isLoggedIn)}
        >
          B ({isLoggedIn ? "Logged In" : "Guest"})
        </button>
      </div>
    </>
  );
}