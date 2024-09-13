import React, { useEffect, useState } from "react";
import "./Message.css";

export default function Message({ own, type, text, attributes, isActive }) {
  useEffect(() => {
    // Initialize all popovers on mount
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach((popover) => {
      new window.bootstrap.Popover(popover, {
        trigger: "click",
        container: "body", // Optional: Make sure the popover is appended to the body
      });
    });
  }, []);

  const [emoji, setEmoji] = useState("");

  const iconStyle = {
    color: own ? "black" : "white",
    size: "14px",
  };

  useEffect(() => {
    console.log(type);
    switch (type) {
      case "STANDARD": {
        setEmoji("");
        break;
      }
      case "SELF_DESTRUCT_TIMED": {
        setEmoji(
          <span class="material-symbols-outlined" style={iconStyle}>
            timer
          </span>
        );
        break;
      }
      case "LIMITED_VIEW_TIME": {
        setEmoji(
          <span class="material-symbols-outlined" style={iconStyle}>
            disabled_visible
          </span>
        );
        break;
      }
      default: {
        setEmoji("");
        break;
      }
    }
    console.log(emoji);
  }, []);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageText">
        {!isActive ? "This is a message" : "THIS MESSAGE IS HIDDEN"}
        <span
          className="emoji"
          style={{
            fontSize: "5px", // Smaller circle
            verticalAlign: "middle", // Align with text
            marginLeft: "5px", // Optional: spacing between text and circle
          }}
        >
          <button
            type="button"
            className="custom-btn"
            data-bs-toggle="popover"
            data-bs-title={
              type === "LIMITED_VIEW_TIME"
                ? "Limited View Time"
                : "Self Destructive Message"
            }
            data-bs-content={
              type === "LIMITED_VIEW_TIME"
                ? `This messagee wiil be visible only from ${attributes?.from} to ${attributes?.to}`
                : `This messagee wiil be deleted in ${
                    attributes?.to - attributes?.from
                  }`
            }
          >
            {emoji}
          </button>
        </span>
      </div>
    </div>
  );
}
