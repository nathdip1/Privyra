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

  const goToDashboard = () => {
    setOpen(false);
    navigate("/dashboard");
  };

  return (
    <header className="neon-header">
      {/* LEFT: Logo + Brand */}
      <div className="header-left">
        <img src="/logo.png" alt="Privyra Logo" className="app-logo" />

        <div className="brand-text">
          <span className="logo-text">Privyra</span>

          <span className="brand-tagline">
            End-to-End Encryption isn’t a promise — it’s our technology.
          </span>

          <span className="brand-subtitle">
            Secure Image Sharing • Upload • Share • Auto-Delete
          </span>
        </div>
      </div>

      {/* CENTER: Scrolling notice */}
      <div className="header-center">
        <div className="ticker">
          <span>
            You can use Privyra to transfer sensitive files securely — please use
            responsibly and do not misuse the platform.
          </span>
        </div>
      </div>

      {/* RIGHT: Profile Avatar */}
      {currentUser && (
        <div className="header-right">
          <div
            className="profile-circle"
            onClick={() => setOpen((prev) => !prev)}
          >
            <img
              src="/avatar.png"
              alt="Profile Avatar"
              className="profile-avatar"
            />
          </div>

          {open && (
            <div className="profile-dropdown">
              <button onClick={goToDashboard}>
                Dashboard
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
