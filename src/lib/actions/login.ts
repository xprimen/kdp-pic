"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { LoginDataResponse, LoginFormInput } from "@/types";
import { getLocalData } from "../jsonProvider";

export const logoutAction = () => {
  cookies().delete("token");
};
export const loginAction = async (
  values: LoginFormInput
): Promise<{
  success: boolean;
  message: string;
  data?: LoginDataResponse;
}> => {
  return fetch(`https://json-server-tester.vercel.app/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        return { success: false, message: "Username atau Password Salah 1" };
      }
      return res.json();
    })
    .then((data) => {
      // console.log("DATA JSON :", data);
      const dataFilter = data.filter(
        (d: { role: string }) => d.role === "PW" || d.role === "PK"
      );
      const filterByUsername = dataFilter.filter(
        (d: { username: string }) => d.username === values.username
      );
      if (filterByUsername.length === 0) {
        return { success: false, message: "Username atau Password Salah 2" };
      }

      if (values.password !== filterByUsername[0].password) {
        return { success: false, message: "Username atau Password Salah 3" };
      }

      cookies().set("token", values.username, { path: "/", httpOnly: true });
      return {
        success: true,
        message: "Berhasil",
        data: {
          role: filterByUsername[0].role,
          username: filterByUsername[0].username,
          name: filterByUsername[0].name,
          id: filterByUsername[0].id,
        },
      };
    })
    .catch((error) => {
      return { success: false, message: "Error" };
    });
};
