// Sign Up
// Reacr Query API call

const baseUrl = "http://localhost:3000/";
import axios from "axios";

export const signUp = async (newUser) => {
  const { data } = await axios
    .post(baseUrl + "auth/signup", newUser)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
  return data;
};
