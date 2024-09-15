// HomeScreen.js
import React, { useState, useRef, useContext, useEffect } from "react";
import "./HomeScreen.css";
import Conversation from "../../components/Conversation/Conversation";
import Message from "../../components/Message/Message";
import WelcomeMessage from "../../components/WelcomeMessage/WelcomeMessage";
import { AuthContext } from "../../context/AuthContext";
import {
  useCreateConversation,
  useCreateMessage,
  useGetAllConversationsByUser,
  useGetMessagesByConversation,
  useUnlockConversation,
} from "../../hooks/useConversationData";
import ContactIcon from "../../assets/contact";
import { useGetAllUsers } from "../../hooks/useUserData";

const HomeScreen = () => {
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const [isUnlocked, setIsUnlocked] = useState(true);

  let createConvModalRef = useRef(null);

  const [isVerified, setIsVerified] = useState(false);
  const [unlockedConversationsList, setUnlockedConversationList] = useState([]);

  const [selectedConversation, setSelectedConversation] = useState(null);

  const [code, setCode] = useState(new Array(6).fill(""));

  const unlockConvModalRef = useRef(null);

  console.log("UnlockedConversationList Main", unlockedConversationsList);

  const openUnlockConversationModal = (conv) => {
    setSelectedConversation(conv);
    if (unlockedConversationsList?.includes(conv._id)) {
      closeUnlockConversationModal();
      return;
    } else {
      const modal = new window.bootstrap.Modal(unlockConvModalRef.current);
      modal.show();
    }
  };

  const closeUnlockConversationModal = () => {
    const modal = window.bootstrap.Modal.getInstance(
      unlockConvModalRef.current
    );
    if (modal) {
      modal.hide();
    }
  };

  const sendCreateConversationRequest = (e) => {
    console.log(e.target.value);
    // Simulate closing the modal after successful request
    const modal = new window.bootstrap.Modal(createConvModalRef.current);
    modal.hide();
  };

  const {
    mutate: unlockConversationMutation,
    isLoading: isLoadingUnlockConversation,
    isSuccess: isSuccessUnlockConversation,
    isError: isErrorUnlockConversation,
    data: dataUnlockConversation,
  } = useUnlockConversation();

  const sendUnlockConversationRequest = (e) => {
    e.preventDefault();
    // Do this using API call
    const unlockData = {
      conversationId: selectedConversation._id,
      enteredPIN: code.join(""),
    };

    console.log(unlockData);
    if (!unlockData) {
      alert("Please enter a valid PIN");
      return;
    }

    unlockConversationMutation(unlockData);
  };

  useEffect(() => {
    if (isSuccessUnlockConversation) {
      console.log("data unlocked cov", dataUnlockConversation);
      if (unlockedConversationsList.includes(selectedConversation._id)) {
        return;
      }
      setUnlockedConversationList([
        ...unlockedConversationsList,
        selectedConversation._id,
      ]);
      closeUnlockConversationModal();
    }

    if (isErrorUnlockConversation) {
      console.log("Error unlocking cov", isErrorUnlockConversation);
      alert("Failed to unlock conversation. Please try again.");
      closeUnlockConversationModal();
    }
  }, [isSuccessUnlockConversation, isErrorUnlockConversation]);

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

  // Get All Conversations By User
  const {
    data: allConversationsByUser,
    isLoading: isLoadingAllConversations,
    isError: isErrorAllConversations,
  } = useGetAllConversationsByUser(user.id);

  // Get Messages By Conversation
  const {
    data: messagesByConversation,
    isLoading: isLoadingMessages,
    isError: isErrorMessages,
  } = useGetMessagesByConversation(
    selectedConversation?._id,
    unlockedConversationsList
  );

  // Get All Users
  const {
    data: allUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useGetAllUsers(user.id);

  const {
    mutate: createConversationMutate,
    isLoading: isCreateConversationLoading,
    isError: isCreateConversationError,
    isSuccess: isCreateConversationSuccess,
    data: createConversationData,
    error: createConversationError,
  } = useCreateConversation();

  const handleCreateConversation = (member) => {
    const conveMembers = {
      members: [user.id, member._id],
    };
    if (conveMembers) {
      createConversationMutate(conveMembers);

      console.log(conveMembers);
    } else {
      alert("Please select a user.");
    }

    // Additional logic for creating the conversation
  };

  useEffect(() => {
    if (isCreateConversationSuccess) {
      alert("Create conversation Successful!");
      closeCreateConversationModal();
    }
  }, [isCreateConversationSuccess]);

  const openCreateConversationModal = () => {
    const modal = new window.bootstrap.Modal(createConvModalRef.current);
    modal.show();
  };
  const closeCreateConversationModal = () => {
    const modal = window.bootstrap.Modal.getInstance(
      createConvModalRef.current
    );
    if (modal) {
      modal.hide();
    }
  };

  const [messageText, setMessageText] = useState("");

  const handleMessageChange = (e, index) => {
    e.preventDefault();
    const { value } = e.target;
    setMessageText(value);
  };

  const {
    mutate: createMessageMutate,
    isLoading: isLoadingMessage,
    isError: isErrorMessage,
    isSuccess: isSuccessMessage,
    data: createMessageData,
    error: createMessageError,
  } = useCreateMessage();

  const sendMessage = (messageAttributes) => {
    const { type } = messageAttributes;
    let messagePayload;

    console.log(type);

    if (type == "STANDARD") {
      messagePayload = {
        text: messageText,
        senderId: user.id,
        conversationId: selectedConversation._id,
        messageType: {
          messageFunc: 0,
          funcAttributes: {
            to: "",
            from: "",
          },
        },
      };
    }

    console.log(messagePayload);

    if (!messagePayload) {
      alert("Please enter a message.");
      return;
    }

    // API Call
    createMessageMutate(messagePayload);
  };

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

  return (
    <div>
      {/* Header */}
      <div>
        <header className="header bg-dark text-white">
          <div
            className="header-wrapper d-flex align-items-center justify-content-between"
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
              <span className="px-2">
                Stealth Messaging App ( {user.userName} )
              </span>
            </span>

            <button
              className="btn btn-sm me-3"
              style={{
                color: "white",
                fontFamily: "Noto Sans",
                fontSize: "14px",
                fontWeight: "bold",
              }}
              onClick={() => {
                dispatch({ type: "LOGOUT" });
                window.location.reload();
              }}
            >
              <span class="material-symbols-outlined">logout</span>
            </button>
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
                  </div>
                  <div className="container">
                    <ul class="list-group w-100 p-3">
                      {allUsers?.map((user) => {
                        return (
                          <li className="list-group-item" key={user?._id}>
                            <button
                              onClick={() => handleCreateConversation(user)}
                            >
                              {user?.userName}
                              <span style={{ fontSize: "10px" }}>
                                {user?.email}
                              </span>
                            </button>
                          </li>
                        );
                      })}
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
            {allConversationsByUser?.conversations?.map((conv) => {
              return (
                <Conversation
                  key={conv.id}
                  // onClick={openUnlockConversationModal}
                  onClick={() => {
                    openUnlockConversationModal(conv);
                  }}
                  conversationData={conv}
                />
              );
            })}
            {/* Unlock Conversation Modal */}
            <div
              className="modal fade"
              id="unlockConvModal"
              data-bs-backdrop="static"
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
                      data-bs-target="#staticBackdrop"
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
          {!isUnlocked || selectedConversation == null ? (
            <WelcomeMessage />
          ) : (
            <div className="chatBoxWrapper">
              <div className="chatBoxTop">
                {messagesByConversation?.messages?.map((message) => {
                  console.log(message);
                  // setOwn to true if user.id is equal to message.senderId
                  console.log("Message eke sendId eka", message.senderId);
                  console.log("log wela inna userge Id eka", user.id);
                  const isOwn = message.senderId === user.id;
                  return <Message own={isOwn} message={message} />;
                })}
              </div>
              <hr />
              <div className="chatBoxBottom">
                <textarea
                  name=""
                  id="chatMessageInput"
                  className="form-control"
                  placeholder="Write Something..."
                  rows={5}
                  onChange={(e, index) => handleMessageChange(e, index)}
                ></textarea>
              </div>
              <div className="chatBoxButtonGrp">
                <button
                  type="button"
                  id="standard"
                  className="btn btn-primary sendBtn"
                  onClick={() => sendMessage({ type: "STANDARD" })}
                >
                  Send
                </button>
                <button
                  type="button"
                  id="limited-view-time"
                  className="btn btn-primary sendBtn"
                >
                  Send Limited View Time Message
                </button>
                <button
                  type="button"
                  id="self-destruct"
                  className="btn btn-primary sendBtn"
                >
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
