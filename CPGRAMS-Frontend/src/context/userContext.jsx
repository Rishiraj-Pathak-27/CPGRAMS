import React, { createContext, useContext, useEffect, useState } from "react";

export const userContext = createContext();

export const UserProvider = ({ children }) => {
  const [profileee, setProfileee] = useState(null);
  const [token, setToken] = useState("");

  const loadSession = () => {
    try {
      const storedToken = localStorage.getItem("token") || "";
      const storedUser = localStorage.getItem("user");
      setToken(storedToken);
      setProfileee(storedUser ? JSON.parse(storedUser) : null);
    } catch (error) {
      console.error("Failed to parse user session:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken("");
      setProfileee(null);
    }
  };

  const setSession = ({ token: nextToken, user }) => {
    localStorage.setItem("token", nextToken || "");
    localStorage.setItem("user", JSON.stringify(user || {}));
    loadSession();
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    loadSession();
  };

  useEffect(() => {
    loadSession();
    window.addEventListener("storage", loadSession);
    return () => window.removeEventListener("storage", loadSession);
  }, []);

  return (
    <userContext.Provider
      value={{
        profileee,
        token,
        isAuthenticated: Boolean(token && profileee),
        setSession,
        clearSession,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useProfile = () => useContext(userContext);
