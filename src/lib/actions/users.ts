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
  /* return await fetch("https://apifk.rurosi.my.id/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      console.log(res.status);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    }); */
  return await axios.post("https://apifk.rurosi.my.id/users", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  // return true;
};
