import React, { useEffect, useState } from "react";
import "./Message.css";
import { decryptMessage, formatEpochToDate } from "../../utils";

export default function Message({ own, message }) {
  const { text, isActive, messageType, conversationId } = message;
  const { messageFunc, funcAttributes } = messageType;
  const { to, from } = funcAttributes;

  const [filteredText, setFilteredText] = useState([]);

  const badWordRepo = ["dog", "animal", "bad"];

  // Decrypt the message
  useEffect(
    () => {
      // Decrypt the message using the provided encryption key
      const decryptedText = decryptMessage(text, conversationId);
      const allWordInText = decryptedText?.split(" ");

      const updatedText = allWordInText?.map((word) => {
        const isBadWord = badWordRepo.includes(word);

        return isBadWord ? "%@^&!#" : word;
      });

      setFilteredText(updatedText || []);
    },
    { message }
  );

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

  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const [emoji, setEmoji] = useState("");

  // useEffect(() => {

  // }, [text]);

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
        {isActive ? (
          filteredText.join(" ")
        ) : (
          <span>
            <i>This message is restricted</i>
          </span>
        )}
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
                : `This message will be deleted in ${
                    to - currentTime > 0
                      ? `${to - currentTime} in seconds`
                      : `${Math.abs(to - currentTime)} seconds ago`
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
