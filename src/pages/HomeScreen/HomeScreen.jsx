// HomeScreen.js
import * as React from "react";
import { useState, useRef, useContext, useEffect } from "react";
import "./HomeScreen.css";
import Conversation from "../../components/Conversation/Conversation";
import Message from "../../components/Message/Message";
import WelcomeMessage from "../../components/WelcomeMessage/WelcomeMessage";
import Header from "../../components/Header/Header";
import { AuthContext } from "../../context/AuthContext";
import {
  useCreateConversation,
  useCreateMessage,
  useGetAllConversationsByUser,
  useGetMessagesByConversation,
  useRemoveConversation,
  useUnlockConversation,
} from "../../hooks/useConversationData";
import ContactIcon from "../../assets/contact";
import { useGetAllUsers } from "../../hooks/useUserData";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { encryptMessage } from "../../utils";

// mUI
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const currentDateTime = dayjs();

  const navigate = useNavigate();

  const srcollRef = useRef();

  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const [isUnlocked, setIsUnlocked] = useState(true);

  let createConvModalRef = useRef(null);

  const [isVerified, setIsVerified] = useState(false);
  const [unlockedConversationsList, setUnlockedConversationList] = useState([]);

  const [selectedConversation, setSelectedConversation] = useState(null);

  const [code, setCode] = useState(new Array(6).fill(""));

  const unlockConvModalRef = useRef(null);

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
      userId: user.id,
    };
    if (!unlockData) {
      alert("Please enter a valid PIN");
      return;
    }

    unlockConversationMutation(unlockData);
  };

  useEffect(() => {
    if (isSuccessUnlockConversation) {
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
  };

  // Get All Conversations By User
  const {
    data: allConversationsByUser,
    isLoading: isLoadingAllConversations,
    isError: isErrorAllConversations,
  } = useGetAllConversationsByUser(user?.id);

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
  } = useGetAllUsers(user?.id);

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
    const { type, funcAttributes } = messageAttributes;

    console.log(type);
    console.log(funcAttributes);

    // Encrypt the message using conversationId as the secretKey
    const encryptedMessageText = encryptMessage(
      messageText,
      selectedConversation._id
    );

    console.log("encrypted message", encryptedMessageText);

    let messagePayload;

    if (type === "STANDARD") {
      messagePayload = {
        text: encryptedMessageText,
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
    if (type === "SELF_DESTRUCT_TIMED") {
      messagePayload = {
        text: encryptedMessageText,
        senderId: user.id,
        conversationId: selectedConversation._id,
        messageType: {
          messageFunc: 1,
          funcAttributes: funcAttributes,
        },
      };
    }
    if (type === "LIMITED_VIEW_TIME") {
      messagePayload = {
        text: encryptedMessageText,
        senderId: user.id,
        conversationId: selectedConversation._id,
        messageType: {
          messageFunc: 2,
          funcAttributes: funcAttributes,
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

  const limitedViewTimeModalRef = useRef(null);

  const openLimitedViewTimeMessage = () => {
    const modal = new window.bootstrap.Modal(limitedViewTimeModalRef.current);
    modal.show();
  };

  const [limitedViewTimeTo, setLimitedViewTimeTo] = useState(null);
  const [limitedViewTimeFrom, setLimitedViewTimeFrom] = useState(null);

  const sendLimitedViewTimeMessage = () => {
    const messageAttributes = {
      type: "LIMITED_VIEW_TIME",
      funcAttributes: {
        to: new Date(limitedViewTimeTo).getTime() / 1000,
        from: new Date(limitedViewTimeFrom).getTime() / 1000,
      },
    };

    console.log(messageAttributes);
    sendMessage(messageAttributes);
  };

  const selfDestructMessageModalRef = useRef(null);
  const openselfDestructMessageModal = () => {
    const modal = new window.bootstrap.Modal(
      selfDestructMessageModalRef.current
    );
    modal.show();
  };

  const [selfDestructTimer, setSelfDestructTimer] = useState(0);
  const sendSelfDestructMessage = () => {
    const messageAttributes = {
      type: "SELF_DESTRUCT_TIMED",
      funcAttributes: {
        from: Math.floor(Date.now() / 1000),
        to: Math.floor(Date.now() / 1000) + parseInt(selfDestructTimer),
      },
    };
    sendMessage(messageAttributes);
  };

  useEffect(() => {
    srcollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByConversation]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const {
    mutate: removeConversationMutation,
    isLoading: isLoadingRemoveConversation,
    isSuccess: isSuccessRemoveConversation,
    isError: isErrorRemoveConversation,
    data: dataRemoveConversation,
    error: errorRemoveConversation,
  } = useRemoveConversation();

  const handleDelete = (conv) => {
    if (selectedConversation) {
      removeConversationMutation({ conversationId: conv._id, userId: user.id });
      setAnchorEl(null);
    }
  };

  useEffect(() => {
    if (isSuccessRemoveConversation) {
      setAnchorEl(null);
      setSelectedConversation(null);
    }
  }, [isSuccessRemoveConversation, selectedConversation]);

  return (
    <div>
      {/* Header */}
      <Header />
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
                <div
                  className="chat-list-item"
                  onClick={() => {
                    openUnlockConversationModal(conv);
                  }}
                >
                  <Conversation
                    key={conv.id}
                    // onClick={openUnlockConversationModal}
                    conversationData={conv}
                  />

                  <div>
                    <Button
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <span
                        class="material-symbols-outlined"
                        style={{ color: "black" }}
                      >
                        more_vert
                      </span>
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={() => setAnchorEl(null)}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={() => handleDelete(conv)}>
                        Delete
                      </MenuItem>
                    </Menu>
                  </div>

                  {/* <button className="btn">
                    <span class="material-symbols-outlined">more_vert</span>
                  </button> */}
                </div>
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
                  const isOwn = message.senderId === user.id;
                  return (
                    <div ref={srcollRef}>
                      <Message own={isOwn} message={message} />
                    </div>
                  );
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
                  onClick={openLimitedViewTimeMessage}
                >
                  Send Limited View Time Message
                </button>
                {/* <!-- Send Limited View Time Message Modal --> */}
                <div
                  className="modal fade"
                  id="sendLimitedViewTimeModal"
                  data-bs-backdrop="static"
                  tabIndex="-1"
                  aria-labelledby="unlockConvModal"
                  aria-hidden="true"
                  ref={limitedViewTimeModalRef}
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Send Limited View Time Message
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="set-time">
                        <p className="form-description">
                          Please Select which time the receiver can view this
                          message
                        </p>
                        <div className="form-control">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateTimePicker"]}>
                              <DateTimePicker
                                label="Select Show From..."
                                value={limitedViewTimeFrom}
                                onChange={(newValue) => {
                                  setLimitedViewTimeFrom(newValue);
                                }}
                                minDateTime={currentDateTime}
                              />
                              <DateTimePicker
                                label="Select Show till..."
                                value={limitedViewTimeTo}
                                onChange={(newValue) => {
                                  setLimitedViewTimeTo(newValue);
                                }}
                                minDateTime={currentDateTime}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="sendBtn w-100"
                          data-bs-dismiss="modal"
                          data-bs-target="#staticBackdrop"
                          onClick={sendLimitedViewTimeMessage}
                        >
                          Send Message
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
                <button
                  type="button"
                  id="self-destruct"
                  className="btn btn-primary sendBtn"
                  onClick={openselfDestructMessageModal}
                >
                  Send Self Destruct Message
                </button>
                <div
                  className="modal fade"
                  id="sendLimitedViewTimeModal"
                  data-bs-backdrop="static"
                  tabIndex="-1"
                  aria-labelledby="unlockConvModal"
                  aria-hidden="true"
                  ref={selfDestructMessageModalRef}
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Send Self Destruct Message
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="set-time">
                        <p className="form-description">
                          Please set the timer to send Self Destruct Message
                        </p>
                        <div className="form-control">
                          <input
                            type="number"
                            class="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Add timer in seconds..."
                            onChange={(e) =>
                              setSelfDestructTimer(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="sendBtn w-100"
                          data-bs-dismiss="modal"
                          data-bs-target="#staticBackdrop"
                          onClick={sendSelfDestructMessage}
                        >
                          Send Message
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
