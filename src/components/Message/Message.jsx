import React, { useEffect, useState } from "react";
import "./Message.css";
import { formatEpochToDate } from "../../utils";

export default function Message({ own, message }) {
  const { text, isActive, messageType } = message;
  const { messageFunc, funcAttributes } = messageType;
  const { to, from } = funcAttributes;

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
    switch (messageFunc) {
      case "STANDARD": {
        setEmoji("");
        break;
      }
      case "SELF_DESTRUCT_TIMED": {
        setEmoji(
          <span className="material-symbols-outlined" style={iconStyle}>
            timer
          </span>
        );
        break;
      }
      case "LIMITED_VIEW_TIME": {
        setEmoji(
          <span className="material-symbols-outlined" style={iconStyle}>
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
  }, []);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageText">
        {!isActive ? text : "THIS MESSAGE IS HIDDEN"}
        <span
          className="emoji"
          style={{
            fontSize: "5px", // Smaller circle
            verticalAlign: "middle", // Align with text
            marginLeft: "5px", // Optional: spacing between text and circle
          }}
        >
          <button
            messageFunc="button"
            className="custom-btn"
            data-bs-toggle="popover"
            data-bs-title={
              messageFunc === "LIMITED_VIEW_TIME"
                ? "Limited View Time"
                : "Self Destructive Message"
            }
            data-bs-content={
              messageFunc === "LIMITED_VIEW_TIME"
                ? `This message wiil be visible only from ${formatEpochToDate(
                    from
                  )} to ${formatEpochToDate(to)}`
                : `This message wiil be deleted in ${
                    to - Math.floor(Date.now() / 1000)
                  } seconds`
            }
          >
            {emoji}
          </button>
        </span>
      </div>
    </div>
  );
}
