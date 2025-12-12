// Client/src/components/Layout.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", backgroundColor: "#f9f9f9" }}>
      {/* Top Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          padding: "0 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          borderBottom: "1px solid #ddd",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="Logo" style={{ height: "40px" }} />
          <h1 style={{ fontSize: "1.2rem" }}>Privyra</h1>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            backgroundColor: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </header>

      {/* Main content */}
      <main style={{ paddingTop: "70px", paddingBottom: "70px", overflowY: "auto" }}>
        {children}
      </main>

      {/* Bottom Nav */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#fff",
          borderTop: "1px solid #ddd",
        }}
      >
        <Link to="/">🏠 Home</Link>
        <Link to="/upload-history">📁 History</Link>
        <Link to="/profile">👤 Profile</Link>
      </nav>
    </div>
  );
};

export default Layout;
