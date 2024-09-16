import React, { useContext, useEffect, useState } from "react";
import "./Conversation.css";
import ContactIcon from "../../assets/contact";
import { useGetUserById } from "../../hooks/useUserData";
import { AuthContext } from "../../context/AuthContext";
import { Button, Box } from "@mui/material";
import { useSendConversationUnlockRequest } from "../../hooks/useConversationData";
import Snackbar from "@mui/material/Snackbar";

export default function Conversation({
  isOnline,
  onClick,
  conversationData,
  deleted,
}) {
  const { members } = conversationData;

  const { user } = useContext(AuthContext);

  const otherMemberId = members.find((member) => member !== user.id);

  // Get Other Member's data from Conversation data passed in
  const {
    data: friendData,
    isLoading: isLoadingAllConversations,
    isError: isErrorAllConversations,
  } = useGetUserById(otherMemberId);

  const {
    mutate: sendUnlockConversation,
    isLoading: isLoadingUnlockConversation,
    isError: isErrorUnlockConversation,
    isSuccess: isSuccessUnlockConversation,
    error: unlockConversationError,
  } = useSendConversationUnlockRequest();

  const [isDeleteRequestSent, setIsDeleteRequestSent] = useState(false);

  const sendUnlockRequest = () => {
    const data = {
      conversationId: conversationData._id,
      userId: user.id,
    };
    sendUnlockConversation(data);
  };

  useEffect(() => {
    if (isSuccessUnlockConversation) {
      setIsDeleteRequestSent(true);
    }
  }, [isSuccessUnlockConversation]);

  return (
    <div className="conversation" onClick={onClick}>
      <div className="conv-left">
        {/* <img
        className="conversationImg"
        src="https://amreckenya.org/wp-content/uploads/2020/11/403022_business-man_male_user_avatar_profile_icon-1.png"
        alt=""
      /> */}
        <ContactIcon />
        <span className="conversationName mx-2">
          {friendData?.userName}
          {!deleted && isOnline ? (
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

      <div className="conv-right">
        {deleted ? (
          <>
            {isDeleteRequestSent ? (
              <Button variant="text" disabled>
                Restore
              </Button>
            ) : (
              <Button variant="text" onClick={sendUnlockRequest}>
                Restore
              </Button>
            )}
          </>
        ) : (
          ""
        )}
      </div>

      <Snackbar
        open={isDeleteRequestSent}
        autoHideDuration={6000}
        onClose={() => {
          console.log("");
        }}
        message="Recovery Request Sent! Please Check your email."
      />
    </div>
  );
}
