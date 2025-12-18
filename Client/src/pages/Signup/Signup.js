// src/pages/Signup/Signup.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateUsername, validatePassword } from "../../utils/validators";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
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
  const [loading, setLoading] = useState(false); // ✅ new

  /* ===============================
     PASSWORD STRENGTH (SIMPLE + SAFE)
  =============================== */
  const getPasswordStrength = () => {
    if (!password) return null;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: "Weak", color: "#ff4d4f" };
    if (score === 3 || score === 4)
      return { label: "Medium", color: "#faad14" };
    return { label: "Strong", color: "#52c41a" };
  };

  const passwordStrength = getPasswordStrength();

  /* ===============================
     SUBMIT HANDLER
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // ✅ prevent duplicate submit

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
      setLoading(true);

      const cleanUsername = username.trim();
      const cleanPassword = password.trim();

      const res = await api.post("/api/auth/signup", {
        username: cleanUsername,
        password: cleanPassword,
      });

      const data = res.data;

      login({ username: data.username, token: data.token });
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.error ||
        "Server error. Try again later.";
      setErrors({ server: message });
    } finally {
      setLoading(false);
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
          {errors.username && (
            <p className="error">{errors.username}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ✅ Password strength indicator */}
          {passwordStrength && (
            <p
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: passwordStrength.color,
              }}
            >
              Password strength: {passwordStrength.label}
            </p>
          )}

          {errors.password && (
            <p className="error">{errors.password}</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />
          {errors.confirmPassword && (
            <p className="error">
              {errors.confirmPassword}
            </p>
          )}

          {/* Terms */}
          <div className="terms-row">
            <label className="terms-label">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) =>
                  setTermsAccepted(e.target.checked)
                }
              />
              <span>
                I accept the{" "}
                <Link to="/terms">Terms & Conditions</Link>
              </span>
            </label>
          </div>
          {errors.terms && (
            <p className="error">{errors.terms}</p>
          )}

          {errors.server && (
            <p className="error">{errors.server}</p>
          )}

          {/* ✅ Disabled while loading */}
          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
