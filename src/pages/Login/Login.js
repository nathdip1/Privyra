import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateUsername, validatePassword } from "../../utils/validators";
import { UserContext } from "../../context/UserContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username) newErrors.username = "Hey, you gotta tell me your username! 😅";
    else if (!validateUsername(username))
      newErrors.username = "Hmm… that username looks sus. Keep it alphanumeric!";

    if (!password) newErrors.password = "Password? Don’t leave it blank! 🔑";
    else if (!validatePassword(password))
      newErrors.password =
        "Whoa! Your password needs 8–12 chars, a capital letter, lowercase, a number & a special symbol. 😎";

    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!userExists) {
        setError({ login: "Invalid credentials ❌" });
        return;
      }

      login(username); // ✅ update context AND localStorage
      navigate("/"); // ✅ redirect to homepage
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "1rem", backgroundColor: "#eef2ff" }}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Welcome back to the world of your Freedom & Anonymity
        </h3>
        <p style={{ fontSize: "0.95rem", color: "#555" }}>
          Log in to share your stories, confessions, and moments without fear.
        </p>
      </div>

      <div className="login-container" style={{ width: "100%", maxWidth: "400px", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Login to your Freedom world 😊</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px" }} />
            {error.username && <p style={{ color: "red", marginTop: "0.25rem" }}>{error.username}</p>}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px" }} />
            {error.password && <p style={{ color: "red", marginTop: "0.25rem" }}>{error.password}</p>}
          </div>

          {error.login && <p style={{ color: "red", marginBottom: "0.5rem", textAlign: "center" }}>{error.login}</p>}

          <button type="submit" style={{ marginTop: "1rem", width: "100%", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#4f46e5", color: "white", fontWeight: "bold", cursor: "pointer", border: "none" }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#4f46e5", fontWeight: "bold" }}>Sign Up</Link>
        </p>

        <p style={{ textAlign: "center", marginTop: "0.25rem", fontSize: "0.8rem", color: "#888" }}>Created by AxomAI</p>
      </div>
    </div>
  );
}

export default Login;
