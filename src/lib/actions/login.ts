"use server";
import { LoginDataResponse, LoginFormInput } from "@/types";
import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { decodeToken } from "../utils";

export const logoutAction = () => {
  cookies().delete("token");
  cookies().delete("userdata");
  cookies().delete("refreshToken");
  redirect("/", RedirectType.replace);
};

export const loginAction = async (
  values: LoginFormInput
): Promise<{
  success: boolean;
  message: string;
  data?: LoginDataResponse;
}> => {
  return await axios
    .post(process.env.BASE_API + "/login", values, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res: AxiosResponse) => {
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      const decodedData = decodeToken<LoginDataResponse>(accessToken);

      if (decodedData.role === "1001") {
        return {
          success: false,
          message: "Login Gagal, User Tidak Memiliki Akses",
        };
      }

      const dataSave: LoginDataResponse = {
        role: String(decodedData.role),
        nama: decodedData.nama,
        userid: decodedData.userid,
        id: decodedData.id,
        mawil: decodedData.mawil,
        submawil: decodedData.submawil,
      };

      cookies().set("token", accessToken, {
        path: "/",
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        secure: process.env.NODE_ENV === "production" ? true : false,
      });
      cookies().set("refreshToken", refreshToken, {
        path: "/",
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        secure: process.env.NODE_ENV === "production" ? true : false,
      });
      cookies().set("userdata", JSON.stringify(dataSave), {
        path: "/",
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        secure: process.env.NODE_ENV === "production" ? true : false,
      });
      return {
        success: true,
        message: "Berhasil",
        data: dataSave,
      };
    })
    .catch((e) => {
      return {
        success: false,
        message:
          "Login Gagal. Cek Kembali Username dan Password Anda atau Hubungi Admin.",
      };
    });
};

export const createUserAction = async (
  values: any
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  return fetch(`${process.env.BASE_API}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
    .then((res) => {
      if (!res.ok) {
        return { success: false, message: "User Gagal Dibuat" };
      }
      return res.json();
    })
    .then((data) => {
      return {
        success: true,
        message: "Berhasil",
      };
    })
    .catch((err) => {
      console.error(err);
      return {
        success: false,
        message: "Login Gagal",
      };
    });
};

export const saveCookie = (cookieName: string, cookieValue: string) => {
  cookies().set(cookieName, cookieValue, {
    path: "/",
    httpOnly: true,
    secure: true,
  });
};
