import React, { useState } from "react";
import "./VerifyUser.css";

export default function VerifyCode() {
  const [code, setCode] = useState(new Array(6).fill(""));
  const userEmail = "youremailAddress@gmail.com"; // This can be dynamic

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        document.getElementById(`digit-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Code submitted:", code.join(""));
  };

  return (
    <div className="main-container">
      {/* Header */}
      <header className="header bg-dark text-white">
        <div
          className="header-wrapper d-flex align-items-center"
          style={{ height: "40px" }}
        >
          <span
            className="px-3 text-left"
            style={{
              fontFamily: "Noto Sans",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "15px" }}
            >
              mark_unread_chat_alt
            </span>
            <span className="px-2">Stealth Messaging App</span>
          </span>
        </div>
      </header>

      {/* Form */}
      <div className="form-container">
        <div className="verify-form">
          <h2 className="form-title">Verify Code</h2>
          <p className="form-description">
            A six-digit code has been sent to <strong>{userEmail}</strong>.
            Please enter it below.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="code-inputs mb-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className="code-input"
                  id={`digit-${index}`}
                  name={`digit-${index}`}
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
              ))}
            </div>
            <button type="submit" className="sendBtn w-100">
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
