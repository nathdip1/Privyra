import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <--- new

  useEffect(() => {
    const storedUser = localStorage.getItem("privyraUser");
    const storedToken = localStorage.getItem("privyraToken");

    if (storedUser && storedToken) {
      setUser({ username: storedUser, token: storedToken });
    }
    setLoading(false); // <--- done initializing
  }, []);

  const login = ({ username, token }) => {
    setUser({ username, token });
    localStorage.setItem("privyraUser", username);
    localStorage.setItem("privyraToken", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("privyraUser");
    localStorage.removeItem("privyraToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
