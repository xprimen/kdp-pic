import { AddUser, TMawil, TSubmawil, TUser } from "@/types";
import axios from "axios";

export const getUsers = async (token: string): Promise<TUser[]> => {
  return await axios
    .get("https://apifk.rurosi.my.id/userspk", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      // console.log("response :", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
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

export const getMawil = async (token: string): Promise<TMawil[]> => {
  return await axios
    .get("https://apifk.rurosi.my.id/mawil", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export const getSubmawil = async (
  token: string,
  mawil: number
): Promise<TSubmawil[]> => {
  return await axios
    .get("https://apifk.rurosi.my.id/submawil/" + mawil, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};
