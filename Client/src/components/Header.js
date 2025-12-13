import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/header.css";

function Header() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="neon-header">
      {/* LEFT: Logo + Brand */}
      <div className="header-left">
        <img
          src="/logo.png"
          alt="Privyra Logo"
          className="app-logo"
        />
        <span className="logo-text">Privyra</span>
      </div>

      {/* RIGHT: Profile */}
      {currentUser && (
        <div className="header-right">
          <div
            className="profile-circle"
            onClick={() => setOpen((prev) => !prev)}
          >
            {currentUser.email?.charAt(0).toUpperCase()}
          </div>

          {open && (
            <div className="profile-dropdown">
              <button onClick={() => navigate("/profile")}>
                Profile
              </button>

              <button onClick={() => navigate("/messages")}>
                Messages
              </button>

              <button onClick={() => navigate("/notifications")}>
                Notifications
              </button>

              <div className="dropdown-divider" />

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
