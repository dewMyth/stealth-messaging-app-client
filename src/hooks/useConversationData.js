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

export const useGetMessagesByConversation = (conversationId) => {
  return useQuery({
    queryKey: ["messages", "getMessagesByConversation", conversationId],
    queryFn: () => getMessagesByConversation(conversationId),
    refetchInterval: 5000, // refetch every 5 seconds
    enabled: !!conversationId, // Only run query if conversationId is available
  });
};
