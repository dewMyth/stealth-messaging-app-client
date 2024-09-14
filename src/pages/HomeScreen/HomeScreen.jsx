// HomeScreen.js
import React, { useState, useRef } from "react";
import "./HomeScreen.css";
import Conversation from "../../components/Conversation/Conversation";
import Message from "../../components/Message/Message";
import WelcomeMessage from "../../components/WelcomeMessage/WelcomeMessage";

const HomeScreen = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const createConvModalRef = useRef(null);
  // const [createConvUser, setCreateConvUser] = useState("");

  const [code, setCode] = useState(new Array(6).fill(""));

  const unlockConvModalRef = useRef(null);

  const openCreateConversationModal = () => {
    const modal = new window.bootstrap.Modal(createConvModalRef.current);
    modal.show();
  };
  const closeCreateConversationModal = () => {
    const modal = new window.bootstrap.Modal(createConvModalRef.current);
    modal.hide();
  };

  const openUnlockConversationModal = () => {
    console.log("Unlock conversation");
    const modal = new window.bootstrap.Modal(unlockConvModalRef.current);
    modal.show();
  };

  const closeUnlockConversationModal = () => {
    console.log("Unlock conversation");
    const modal = new window.bootstrap.Modal(unlockConvModalRef.current);
    modal.hide();
  };

  const sendCreateConversationRequest = (e) => {
    console.log(e.target.value);
    // Simulate closing the modal after successful request
    const modal = new window.bootstrap.Modal(createConvModalRef.current);
    modal.hide();
  };

  const sendUnlockConversationRequest = (e) => {
    console.log(e.target.value);
    setIsUnlocked(true);
    // Simulate closing the modal after successful request
    const modal = new window.bootstrap.Modal(unlockConvModalRef.current);
    modal.hide();
  };

  const handleUnlockPINChange = (e, index) => {
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

  const handleUnlockPINSubmit = (e) => {
    e.preventDefault();
    console.log("Code submitted:", code.join(""));
  };

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
                className="material-symbols-outlined"
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
              <button
                className="create-conv-btn"
                onClick={openCreateConversationModal}
              >
                <span className="material-symbols-outlined">edit_square</span>
              </button>
            </div>

            {/* Create Conversation Modal */}
            <div
              className="modal fade"
              id="createConvModal"
              tabIndex="-1"
              aria-labelledby="createConvModal"
              aria-hidden="true"
              ref={createConvModalRef}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Create a Conversation with...
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="container">
                    <ul class="list-group w-100 p-3">
                      <li
                        class="list-group-item"
                        onClick={sendCreateConversationRequest}
                      >
                        An item
                      </li>
                      <li
                        class="list-group-item"
                        onClick={sendCreateConversationRequest}
                      >
                        A second item
                      </li>
                      <li class="list-group-item">A third item</li>
                      <li class="list-group-item">A fourth item</li>
                      <li class="list-group-item">And a fifth one</li>
                    </ul>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      data-bs-dismiss="modal"
                      onClick={closeCreateConversationModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Create Conversation Modal */}
            <hr />
            <input
              type="search"
              className="form-control"
              id="search"
              placeholder="Search for a chat"
            />
            <Conversation onClick={openUnlockConversationModal} />
            <Conversation onClick={openUnlockConversationModal} />
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
            {/* Unlock Conversation Modal */}
            <div
              className="modal fade"
              id="unlockConvModal"
              tabIndex="-1"
              aria-labelledby="unlockConvModal"
              aria-hidden="true"
              ref={unlockConvModalRef}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Unlock Conversation
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="verify-code">
                    <p className="form-description">
                      Please Enter the Conversation PIN sent via the registered
                      email to Unlock the Conversation
                    </p>
                    <form onSubmit={handleUnlockPINSubmit}>
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
                            onChange={(e) => handleUnlockPINChange(e, index)}
                            required
                          />
                        ))}
                      </div>
                    </form>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="sendBtn w-100"
                      data-bs-dismiss="modal"
                      onClick={sendUnlockConversationRequest}
                    >
                      Unlock
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      data-bs-dismiss="modal"
                      onClick={closeUnlockConversationModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Unlock Conversation Modal */}
          </div>
        </div>
        <div className="chatBox">
          {!isUnlocked ? (
            <WelcomeMessage />
          ) : (
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
                <Message
                  own={true}
                  isActive={true}
                  type="SELF_DESTRUCT_TIMED"
                />
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
                <button type="button" className="btn btn-primary sendBtn">
                  Send
                </button>
                <button type="button" className="btn btn-primary sendBtn">
                  Send Limited View Time Message
                </button>
                <button type="button" className="btn btn-primary sendBtn">
                  Send Self Destruct Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
