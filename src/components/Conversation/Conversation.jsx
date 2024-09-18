import React, { useContext, useEffect, useState } from "react";
import "./Conversation.css";
import ContactIcon from "../../assets/contact";
import { useGetUserById } from "../../hooks/useUserData";
import { AuthContext } from "../../context/AuthContext";
import { Button, Box } from "@mui/material";
import {
  useRemoveConversation,
  useSendConversationUnlockRequest,
} from "../../hooks/useConversationData";
import Snackbar from "@mui/material/Snackbar";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import LockIcon from "@mui/icons-material/Lock";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Conversation({
  onClick,
  conversationData,
  deleted,
  unlockedConversationsList,
  isOnline,
}) {
  const { members } = conversationData;

  const { user } = useContext(AuthContext);

  const otherMemberId = members.find((member) => member !== user?.id);

  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  useEffect(() => {
    if (unlockedConversationsList?.length) {
      // Find this conversation in unlockedConversationsList
      const isInclude = unlockedConversationsList.includes(
        conversationData._id
      );
      setShowDeleteIcon(isInclude);
    }
  }, [unlockedConversationsList]);

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
      userId: user?.id,
    };
    sendUnlockConversation(data);
  };

  useEffect(() => {
    if (isSuccessUnlockConversation) {
      setIsDeleteRequestSent(true);
      setIsDeleteOpen(false);
    }
  }, [isSuccessUnlockConversation]);

  const {
    mutate: removeConversationMutation,
    isLoading: isLoadingRemoveConversation,
    isSuccess: isSuccessRemoveConversation,
    isError: isErrorRemoveConversation,
    data: dataRemoveConversation,
    error: errorRemoveConversation,
  } = useRemoveConversation();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    if (isSuccessRemoveConversation) {
      handleDelete();
    }
  }, []);

  // const [secondary, setSecondary] = React.useState(true);

  return (
    <div className="chat-item">
      <ListItem
        secondaryAction={
          deleted ? (
            <IconButton
              sx={{ color: "black" }}
              color="inherit"
              onClick={(event) => {
                event.stopPropagation();
                // Stop the event from bubbling up to the parent div
                handleDelete();
              }}
            >
              <RestoreIcon />
            </IconButton>
          ) : showDeleteIcon ? (
            <IconButton
              sx={{ color: "black" }}
              color="inherit"
              onClick={(event) => {
                handleDelete();
              }}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <IconButton sx={{ color: "black" }} color="inherit">
              <LockIcon />
            </IconButton>
          )
        }
      >
        <ListItemAvatar>
          <Avatar sx={{ backgroundColor: "black" }} color="inherit">
            <ContactMailIcon sx={{ color: "white" }} color="inherit" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${friendData?.userName} ${isOnline ? "  ●  " : ""}`}
          // secondary={isOnline ? "Online" : "Offline"}
          sx={{ fontWeight: "bold" }}
        />
      </ListItem>

      <Snackbar
        open={isDeleteRequestSent}
        autoHideDuration={6000}
        onClose={() => {
          console.log("");
        }}
        message="Recovery Request Sent! Please Check your email."
      />
      <Snackbar
        open={isSuccessRemoveConversation}
        autoHideDuration={6000}
        onClose={() => {
          console.log("");
        }}
        message="Conversation Deleted!"
      />

      <Dialog
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {deleted
            ? "Recover the deleted conversation"
            : "Delete this conversation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to ${
              deleted ? "recover" : "delete"
            } this conversation?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDeleteOpen(false);
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              deleted
                ? sendUnlockRequest()
                : removeConversationMutation({
                    conversationId: conversationData._id,
                    userId: user?.id,
                  });
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
