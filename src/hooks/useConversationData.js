import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const baseUrl = "http://localhost:5000/";

const getAllConversationsByUser = async (userId) => {
  const response = await axios.get(
    baseUrl + `conversations/get-all-conversation-by-user/${userId}`,
    { userId }
  );
  return response.data;
};

export const useGetAllConversationsByUser = (userId) => {
  return useQuery({
    queryKey: ["conversations", "getAllConversationsByUser", userId],
    queryFn: () => getAllConversationsByUser(userId),
    refetchInterval: 60000, // refetch every minute
    enabled: !!userId, // Only run query if userId is available
  });
};

const getMessagesByConversation = async (conversationId) => {
  const response = await axios.get(
    baseUrl + `messages/get-all-messages-by-conversation/${conversationId}`,
    { conversationId }
  );
  return response.data;
};

export const useGetMessagesByConversation = (
  conversationId,
  unlockedConversationsList
) => {
  const letConversationIsUnlocked = unlockedConversationsList.some(
    (convId) => convId === conversationId
  );

  return useQuery({
    queryKey: ["messages", "getMessagesByConversation", conversationId],
    queryFn: () => getMessagesByConversation(conversationId),
    refetchInterval: 1000, // refetch every 1 seconds
    enabled: !!conversationId && letConversationIsUnlocked, // Only run query if conversationId is available, and conversation is unlocked
  });
};

const createConversation = async (members) => {
  const response = await axios.post(
    baseUrl + "conversations/create-conversation",
    members
  );
  return response.data;
};

export const useCreateConversation = () => {
  return useMutation({
    mutationFn: createConversation,
    onError: (err) => {
      if (err.response) {
        throw err.response.data.message;
      } else {
        throw err.message; // re-throw the error
      }
    },
  });
};

const unlockConversation = async (data) => {
  const response = await axios.post(
    baseUrl + "conversations/unlock-conversation",
    data
  );
  return response.data;
};

export const useUnlockConversation = () => {
  return useMutation({
    mutationFn: unlockConversation,
    onError: (err) => {
      if (err.response) {
        throw err.response.data.message;
      } else {
        throw err.message; // re-throw the error
      }
    },
  });
};

const createMessage = async (data) => {
  const response = await axios.post(baseUrl + "messages/create-message", data);
  return response.data;
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMessage,
    onSuccess: (data) => {
      // Update the conversation list to include the new message
      queryClient.invalidateQueries([
        "messages",
        "getMessagesByConversation",
        data.conversationId,
      ]);
    },
    onError: (err) => {
      if (err.response) {
        throw err.response.data.message;
      } else {
        throw err.message; // re-throw the error
      }
    },
  });
};

const removeConversation = async (data) => {
  const response = await axios.post(
    baseUrl + `conversations/delete-conversation`,
    data
  );
  return response.data;
};

export const useRemoveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeConversation,
    onSuccess: (data) => {
      // Update the conversation list to exclude the deleted conversation
      queryClient.invalidateQueries([
        "conversations",
        "getAllConversationsByUser",
      ]);
    },
    onError: (err) => {
      if (err.response) {
        throw err.response.data.message;
      } else {
        throw err.message; // re-throw the error
      }
    },
  });
};

const getRemovedConvByUser = async (userId) => {
  const response = await axios.get(
    baseUrl + `conversations/deleted-conversations/${userId}`
  );
  console.log(response.data);
  return response.data;
};

export const useGetRemovedConvByUser = (userId) => {
  return useQuery({
    queryKey: ["deletedConversations", userId],
    queryFn: () => getRemovedConvByUser(userId),
    enabled: !!userId, // Only run query if userId is available
  });
};
