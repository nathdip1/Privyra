import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // new

  useEffect(() => {
    const storedUser = localStorage.getItem("privyraUser");
    const token = localStorage.getItem("privyraToken");
    if (storedUser && token) setCurrentUser({ username: storedUser, token });
    setLoading(false); // done reading localStorage
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("privyraUser", userData.username);
    localStorage.setItem("privyraToken", userData.token);
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
