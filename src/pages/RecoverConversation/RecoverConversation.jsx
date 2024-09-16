import React, { useState, useContext, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useRecoverConversation } from "../../hooks/useConversationData";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";

export default function RecoverConversation() {
  const [code, setCode] = useState(new Array(6).fill(""));

  const { user } = useContext(AuthContext);

  const [searchParams] = useSearchParams();

  const conversationId = searchParams.get("conversationId");

  const navigate = useNavigate();

  console.log(searchParams);

  // const [searchParams] = useParams();

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

  const {
    mutate: recoverConversation,
    isLoading: isLoadingRecoverConversation,
    isError: isErrorRecoverConversation,
    isSuccess: isSuccessRecoverConversation,
    data: dataRecoverConversation,
    error: errorRecoverConversation,
  } = useRecoverConversation();

  const handleSubmit = (e) => {
    e.preventDefault();

    let constructedCode = code.join("");

    const data = {
      conversationId: conversationId,
      verificationCode: constructedCode,
      userId: user.id,
    };

    console.log(data);
    recoverConversation(data);
  };

  useEffect(() => {
    console.log(
      dataRecoverConversation,
      errorRecoverConversation?.response?.data?.message
    );
    if (isSuccessRecoverConversation) {
      // Navigate back to Main page
      navigate("/");
    } else {
      if (isErrorRecoverConversation) {
        // alert(errorRecoverConversation);
      }
    }
  }, [isSuccessRecoverConversation, isErrorRecoverConversation]);

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
            A six-digit code has been sent to your email. Please enter it below
            to recover the conversation deleted.
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

      <Snackbar
        open={isErrorRecoverConversation}
        autoHideDuration={6000}
        onClose={() => {
          console.log("");
        }}
        message={errorRecoverConversation?.response?.data?.message}
      />
    </div>
  );

  // verifyUserMutate({ email: email, verificationCode: constructedCode });
}
