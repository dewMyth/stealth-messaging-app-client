import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { convertTimetoAsiaColombo } from "../utils";

const baseUrl = "http://localhost:5000/";

const getAllLogsByUser = async (userId) => {
  const response = await axios.get(
    baseUrl + `logs/get-all-logs-by-user/${userId}`
  );

  let filteredData;
  if (response.data.length > 0) {
    filteredData = response.data?.map((log) => {
      return {
        id: log._id,
        message: log.message,
        type: log.type,
        time: log.time,
      };
    });
  }
  return filteredData;
};

export const useGetAllLogsByUser = (userId) => {
  return useQuery({
    queryKey: ["logs", "getAllLogsByUser", userId],
    queryFn: () => getAllLogsByUser(userId),
    refetchInterval: 60000, // refetch every minute
    enabled: !!userId, // Only run query if userId is available
  });
};
