import React from "react";
import "./Conversation.css";

export default function Conversation({ isOnline, onClick }) {
  return (
    <div className="conversation" onClick={onClick}>
      <img
        className="conversationImg"
        src="https://amreckenya.org/wp-content/uploads/2020/11/403022_business-man_male_user_avatar_profile_icon-1.png"
        alt=""
      />
      <span className="conversationName">
        John Doe
        {isOnline ? (
          <span
            style={{
              fontSize: "7px", // Smaller circle
              verticalAlign: "middle", // Align with text
              marginLeft: "5px", // Optional: spacing between text and circle
            }}
          >
            🟢
          </span>
        ) : (
          ""
        )}
      </span>
    </div>
  );
}
