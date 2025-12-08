// src/pages/Terms/Terms.js
import React from "react";
import { Link } from "react-router-dom";

function Terms() {
  return (
    // ✅ FULL SCREEN WRAPPER — PREVENTS LEFT/RIGHT SCROLL
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        overflowX: "hidden",
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* ✅ RESPONSIVE CONTENT CONTAINER */}
      <div
        className="terms-container"
        style={{
          width: "100%",
          maxWidth: "700px",
          padding: "1.5rem",
          lineHeight: "1.6",
          boxSizing: "border-box",
          wordWrap: "break-word",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Terms and Conditions</h1>
        <p style={{ textAlign: "center", color: "#555" }}>
          Last updated: December 2025
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using our social media platform, you agree to comply
          with and be bound by these Terms and Conditions. Please read them
          carefully.
        </p>

        <h2>2. User Accounts</h2>
        <p>
          You must provide accurate information when creating an account. You are
          responsible for safeguarding your account credentials and for all
          activities under your account.
        </p>

        <h2>3. User Conduct</h2>
        <p>
          You agree not to post content that is illegal, offensive, abusive, or
          infringes on anyone's rights. We reserve the right to remove any
          content that violates these terms.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          All content on the platform is the property of the site or its
          licensors. Users may not copy, reproduce, or distribute content
          without permission.
        </p>

        <h2>5. Termination</h2>
        <p>
          We may suspend or terminate accounts for violations of these Terms
          and Conditions without prior notice.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          We are not liable for any direct or indirect damages arising from
          your use of the platform.
        </p>

        <h2>7. Changes to Terms</h2>
        <p>
          We may update these Terms and Conditions from time to time. Users
          are encouraged to review them periodically.
        </p>

        <p style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link
            to="/signup"
            style={{ color: "#4f46e5", textDecoration: "underline" }}
          >
            Go back to Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Terms;
