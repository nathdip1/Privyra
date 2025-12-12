// Client/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("privyraUser");
    const storedToken = localStorage.getItem("privyraToken");
    if (storedUser && storedToken) {
      setCurrentUser({ username: storedUser, token: storedToken });
    }
    setLoading(false);
  }, []);

  const login = ({ username, token }) => {
    setCurrentUser({ username, token });
    localStorage.setItem("privyraUser", username);
    localStorage.setItem("privyraToken", token);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("privyraUser");
    localStorage.removeItem("privyraToken");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
