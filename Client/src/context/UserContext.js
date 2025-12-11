import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("privyraUser");
    const token = localStorage.getItem("privyraToken");
    if (storedUser && token) setCurrentUser({ username: storedUser, token });
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
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
