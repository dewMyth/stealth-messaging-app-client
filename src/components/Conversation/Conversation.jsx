import React, { useContext } from "react";
import "./Conversation.css";
import ContactIcon from "../../assets/contact";
import { useGetUserById } from "../../hooks/useUserData";
import { AuthContext } from "../../context/AuthContext";

export default function Conversation({ isOnline, onClick, conversationData }) {
  const { members } = conversationData;

  const { user } = useContext(AuthContext);

  const otherMemberId = members.find((member) => member !== user.id);

  // Get Other Member's data from Conversation data passed in
  const {
    data: friendData,
    isLoading: isLoadingAllConversations,
    isError: isErrorAllConversations,
  } = useGetUserById(otherMemberId);

  return (
    <div className="conversation" onClick={onClick}>
      {/* <img
        className="conversationImg"
        src="https://amreckenya.org/wp-content/uploads/2020/11/403022_business-man_male_user_avatar_profile_icon-1.png"
        alt=""
      /> */}
      <ContactIcon />
      <span className="conversationName mx-2">
        {friendData?.userName}
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
