import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

// const queryClient = useQueryClient();

const baseUrl = "http://localhost:5000/";

const addNewUser = async (newUser) => {
  const response = await axios.post(baseUrl + `auth/signup`, newUser);
  return response.data;
};

export const useAddUser = () => {
  // No Need of onSuccess, onError, onSettled here since we don't want list of users after signup completes
  return useMutation({
    mutationFn: addNewUser,
    onError: (err) => {
      console.log(err);
      if (err.response) {
        throw err.response.data.message;
      } else {
        throw err.message; // re-throw the error
      }
    },
  });
};

const verifyUser = async (user) => {
  const response = await axios.post(baseUrl + `users/verify-user`, user);
  return response.data;
};

export const useVerifyUser = () => {
  return useMutation({
    mutationFn: verifyUser,
    onError: (err) => {
      if (err.response) {
        throw err.response.data.message;
      } else {
        throw err.message; // re-throw the error
      }
    },
  });
};

const loginUser = async (user) => {
  const response = await axios.post(baseUrl + `auth/login`, user);
  return response.data;
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
    onError: (err) => {
      if (err.response) {
        throw err.response.data.message;
      } else {
        throw err.message; // re-throw the error
      }
    },
  });
};

const getUserById = async (userId) => {
  const response = await axios.get(baseUrl + `users/get-user-by-id/${userId}`, {
    userId,
  });
  return response.data;
};

export const useGetUserById = (userId) => {
  return useQuery({
    queryKey: ["getUserById", userId],
    queryFn: () => getUserById(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
    // refetchInterval: 1000 * 60 * 15, // 15 minutes refetch interval
    enabled: !!userId,
  });
};
