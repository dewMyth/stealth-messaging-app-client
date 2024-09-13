// HomeScreen.js
import React from "react";
import "./HomeScreen.css";
import Conversation from "../../components/Conversation/Conversation";
import Message from "../../components/Message/Message";

const HomeScreen = () => {
  return (
    <div>
      {/* Header */}
      <div>
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
                class="material-symbols-outlined"
                style={{ fontSize: "15px" }}
              >
                mark_unread_chat_alt
              </span>
              <span className="px-2">Stealth Messaging App</span>
            </span>
          </div>
        </header>
      </div>
      {/* Header */}
      <div className="home-screen">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="chatMenuWrapperTop">
              <h3>Chats</h3>
              <span class="material-symbols-outlined">edit_square</span>
            </div>
            <hr />
            <input
              type="search"
              class="form-control"
              id="search"
              placeholder="Search for a chat"
            />
            <Conversation />
            <Conversation />
            <Conversation isOnline={true} />
            <Conversation />
            <Conversation isOnline={true} />
            <Conversation isOnline={true} />
            <Conversation />
            <Conversation isOnline={true} />
            <Conversation />
            <Conversation />
            <Conversation isOnline={true} />
            <Conversation />
            <Conversation />
            <Conversation />
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxTop">
              <Message />
              <Message own={true} type="LIMITED_VIEW_TIME" />
              <Message />
              <Message type="SELF_DESTRUCT_TIMED" />
              <Message />
              <Message type="LIMITED_VIEW_TIME" />
              <Message own={true} />
              <Message />
              <Message own={true} isActive={true} type="SELF_DESTRUCT_TIMED" />
              <Message />
              <Message />
              <Message />
              <Message own={true} />
              <Message />
              <Message own={true} />
              <Message />
            </div>
            <hr />
            <div className="chatBoxBottom">
              <textarea
                name=""
                id="chatMessageInput"
                className="form-control"
                placeholder="Write Something..."
                rows={5}
              ></textarea>
            </div>
            <div className="chatBoxButtonGrp">
              <button type="button" class="btn btn-primary" className="sendBtn">
                Send
              </button>
              <button type="button" class="btn btn-primary" className="sendBtn">
                Send Limited View Time Message
              </button>
              <button type="button" class="btn btn-primary" className="sendBtn">
                Send Self Destruct Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
