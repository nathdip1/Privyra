// src/pages/Signup/Signup.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateUsername, validatePassword } from "../../utils/validators";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth.css";

function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [hovered, setHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    else if (!validateUsername(username))
      newErrors.username = "Only letters and numbers are allowed";

    if (!password) newErrors.password = "Password cannot be empty";
    else if (!validatePassword(password))
      newErrors.password =
        "Password must be 8–12 characters with upper, lower, number & special character";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!termsAccepted)
      newErrors.terms = "You must accept the terms and conditions";

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ username: data.message });
        return;
      }

      login({ username: data.username, token: data.token });
      navigate("/login");
    } catch (err) {
      setErrors({ server: "Server error. Try again later." });
    }
  };

  return (
    <div className="auth-page">
      {/* Logo */}
      <div className="auth-header">
        <img
          src={process.env.PUBLIC_URL + "/logo.png"}
          alt="Privyra Logo"
          className="auth-logo"
          style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />

        <h2>Create your Privyra Account</h2>
        <p>Join Privyra to manage secure access.</p>
      </div>

      {/* Signup Form */}
      <div className="form-container neon-card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p className="error">{errors.username}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          {/* ✅ FIXED TERMS ALIGNMENT */}
          <div className="terms-row">
            <label className="terms-label">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span>
                I accept the <Link to="/terms">Terms & Conditions</Link>
              </span>
            </label>
          </div>
          {errors.terms && <p className="error">{errors.terms}</p>}

          <button type="submit" className="primary-btn">
            Sign Up
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
