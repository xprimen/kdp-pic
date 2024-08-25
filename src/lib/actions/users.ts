import { AddUser } from "@/types";
import axios from "axios";

export const getUsers = async (token: string) => {
  return await axios.get("https://apifk.rurosi.my.id/userspw", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const saveUser = async ({
  data,
  token,
}: {
  data: AddUser;
  token: string;
}) => {
  return await axios.post("https://apifk.rurosi.my.id/users", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  // return true;
};
