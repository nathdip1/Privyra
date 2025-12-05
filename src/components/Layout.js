import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { logout, user } = useContext(UserContext);

  const handleLogout = () => {
    logout(); // clear user from context and localStorage
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* ✅ FIXED TOP HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          padding: "0 1rem",
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="App Logo"
            style={{ height: "40px" }}
          />
          <h1 style={{ marginLeft: "1rem", fontSize: "1.2rem" }}>
            Freedom
          </h1>
          {user && (
            <span style={{ marginLeft: "1rem", color: "#555" }}>
              Hello, <strong>{user.username}</strong>!
            </span>
          )}
        </div>

        {/* Logout button */}
        {user && (
          <button
            onClick={handleLogout}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#ef4444",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            title="Logout"
          >
            🚪 Logout
          </button>
        )}
      </header>

      {/* ✅ MAIN CONTENT */}
      <main
        style={{
          position: "absolute",
          top: "60px",
          bottom: "70px",
          left: 0,
          right: 0,
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        {children}
      </main>

      {/* ✅ FIXED BOTTOM NAV */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70px",
          borderTop: "1px solid #ddd",
          padding: "0.5rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          zIndex: 1000,
        }}
      >
        <Link to="/" style={{ textAlign: "center", textDecoration: "none" }}>
          <div>🏠</div>
          <small>Feed</small>
        </Link>

        <Link
          to="/notifications"
          style={{ textAlign: "center", textDecoration: "none" }}
        >
          <div>🔔</div>
          <small>Notifications</small>
        </Link>

        <Link
          to="/messages"
          style={{ textAlign: "center", textDecoration: "none" }}
        >
          <div>💬</div>
          <small>Chat</small>
        </Link>

        <Link
          to="/search"
          style={{ textAlign: "center", textDecoration: "none" }}
        >
          <div>🔍</div>
          <small>Search</small>
        </Link>

        <Link
          to="/profile"
          style={{ textAlign: "center", textDecoration: "none" }}
        >
          <div>👤</div>
          <small>Profile</small>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
