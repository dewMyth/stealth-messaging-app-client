import React from "react";
import "./WelcomeMessage.css"; // Import the CSS file

const WelcomeMessage = () => {
  return (
    <div className="container">
      <div className="text-container">
        <h1>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "100px" }}
          >
            mark_unread_chat_alt
          </span>
        </h1>
        <h4>Welcome to Stealth Messaging App</h4>
        <span>Your Secure Messaging Portal.</span>
      </div>
    </div>
  );
};

export default WelcomeMessage;
