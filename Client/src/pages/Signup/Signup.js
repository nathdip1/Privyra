// src/pages/Signup/Signup.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateUsername, validatePassword } from "../../utils/validators";
import { UserContext } from "../../context/UserContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
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

    if (Object.keys(newErrors).length === 0) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find((u) => u.username === username);
      if (existingUser) {
        setErrors({ username: "Username already exists" });
        return;
      }

      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));

      login(username);
      navigate("/login");
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6", flexDirection: "column", padding: "1rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Welcome to Privyra
        </h3>
        <p style={{ fontSize: "0.95rem", color: "#555" }}>
          Create your private account to securely access all Privyra features.
        </p>
      </div>

      <div className="signup-container" style={{ maxWidth: "400px", width: "100%", padding: "2rem", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#f9f9f9", boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Create Your Privyra Account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: "1rem" }}>
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" style={{ width: "100%", padding: "0.6rem", borderRadius: "6px" }} />
            {errors.username && <p style={{ color: "red", marginTop: "0.25rem" }}>{errors.username}</p>}
            <small>Unique alphanumeric username</small>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1rem" }}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" style={{ width: "100%", padding: "0.6rem", borderRadius: "6px" }} />
            {errors.password && <p style={{ color: "red", marginTop: "0.25rem" }}>{errors.password}</p>}
            <small>8–12 characters with required security rules</small>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "1rem" }}>
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" style={{ width: "100%", padding: "0.6rem", borderRadius: "6px" }} />
            {errors.confirmPassword && <p style={{ color: "red", marginTop: "0.25rem" }}>{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} /> I agree to the{" "}
              <Link to="/terms" style={{ color: "#4f46e5", textDecoration: "underline" }}>terms and conditions</Link>
            </label>
            {errors.terms && <p style={{ color: "red", marginTop: "0.25rem" }}>{errors.terms}</p>}
          </div>

          <button type="submit" style={{ marginTop: "0.5rem", width: "100%", padding: "0.8rem", borderRadius: "8px", backgroundColor: "#4f46e5", color: "white", fontWeight: "bold", cursor: "pointer", border: "none", fontSize: "1rem" }}>
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have a Privyra account? <Link to="/login" style={{ color: "#4f46e5", fontWeight: "bold" }}>Login here</Link>
        </p>

        <p style={{ textAlign: "center", marginTop: "0.25rem", fontSize: "0.8rem", color: "#888" }}>
          Powered by Privyra
        </p>
      </div>
    </div>
  );
}

export default Signup;
