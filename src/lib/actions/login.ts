"use server";
import { LoginDataResponse, LoginFormInput } from "@/types";
import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeToken } from "../utils";
import { setCookie } from "cookies-next";

export const logoutAction = () => {
  cookies().delete("token");
  cookies().delete("userdata");
  cookies().delete("refreshToken");
  redirect("/");
};
export const loginAction = async (
  values: LoginFormInput
): Promise<{
  success: boolean;
  message: string;
  data?: LoginDataResponse;
}> => {
  return await axios
    .post("https://apifk.rurosi.my.id/login", values, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res: AxiosResponse) => {
      // console.log(res.data);
      /* let refreshToken = "";
      let expiresRefreshToken = "";
      let maxAgeRefreshToken = 0;
      if (res.headers) {
        const headerCookies = res.headers["set-cookie"]
          ? res.headers["set-cookie"][0]
          : "";
        const getRefreshToken = headerCookies.split("; ") || [];
        refreshToken = getRefreshToken[0].split("=")[1];
        maxAgeRefreshToken = Number(getRefreshToken[1].split("=")[1]);
        expiresRefreshToken = getRefreshToken[3].split("=")[1];
        // cookies().set("refreshToken", refreshToken);
        // console.log(getRefreshToken);
      } */
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      // console.log("refreshToken :", refreshToken);
      // const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI5ZjgyNGEyNC02ZWE5LTRjYzktYjg2OC04OTAwNjU0MjViM2YiLCJuYW1hIjoiRW5nZ2EgUFcyIiwicm9sZSI6MiwiaWF0IjoxNzI0MzQ0MjQ0LCJleHAiOjE3MjY5MzYyNDR9.HxGmmtFtw2pdZCC3N5EUeZ07-3_cN2TuNm4wJe1hiXI";
      const decodedData = decodeToken<
        Omit<LoginDataResponse, "userid"> & { userid: string }
      >(accessToken);

      // refreshToken decode
      // let base64UrlRT = refreshToken.split(".")[1];
      // let base64RT = base64UrlRT.replace("-", "+").replace("_", "/");
      // let decodedDataRT = JSON.parse(
      //   Buffer.from(base64RT, "base64").toString("binary")
      // );

      if (decodedData.role === "1001") {
        return {
          success: false,
          message: "Login Gagal, User Tidak Memiliki Akses",
        };
      }

      const dataSave: LoginDataResponse = {
        role: String(decodedData.role),
        // username: values.username,
        nama: decodedData.nama,
        id: decodedData.userid,
        mawil: decodedData.mawil,
        submawil: decodedData.submawil,
      };

      cookies().set("token", accessToken, {
        path: "/",
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        secure: process.env.NODE_ENV === "production" ? true : false,
        // expires: decodedData.exp * 1000,
      });
      cookies().set("refreshToken", refreshToken, {
        path: "/",
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        secure: process.env.NODE_ENV === "production" ? true : false,
        // maxAge: maxAgeRefreshToken,
        // sameSite: "none",
        // expires: decodedDataRT.exp * 1000,
      });
      cookies().set("userdata", JSON.stringify(dataSave), {
        path: "/",
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        secure: process.env.NODE_ENV === "production" ? true : false,
        // expires: new Date(decodedData.exp * 1000),
      });
      return {
        success: true,
        message: "Berhasil",
        data: dataSave,
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
  return fetch(`https://apifk.rurosi.my.id/users`, {
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
        // data: data,
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
    // expires: decodedData.exp * 1000,
  });
};

// export const refreshingToken = async (refreshToken: string) => {
//   await axios
//     .get(`/token`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${refreshToken}`,
//       },
//     })
//     .then(async ({ data }) => {
//       // console.log("response :", data);
//       const newAccessToken = data.accessToken;
//       const newRefreshToken = data.refreshToken;

//       const decodedData = decodeToken<
//         Omit<LoginDataResponse, "userid"> & { userid: string }
//       >(newAccessToken);

//       // cookies().set("token", newAccessToken, {
//       //   path: "/",
//       //   httpOnly: true,
//       //   secure: true,
//       //   // expires: decodedData.exp * 1000,
//       // });
//       setCookie("refreshToken", newRefreshToken, {
//         path: "/",
//         httpOnly: true,
//         secure: true,
//         // maxAge: maxAgeRefreshToken,
//         // sameSite: "none",
//         // expires: decodedDataRT.exp * 1000,
//       });

//       const dataSave: LoginDataResponse = {
//         role: String(decodedData.role),
//         nama: decodedData.nama,
//         id: decodedData.userid,
//         mawil: decodedData.mawil,
//         submawil: decodedData.submawil,
//       };

//       setCookie("userdata", JSON.stringify(dataSave), {
//         path: "/",
//         httpOnly: true,
//         secure: true,
//         // expires: new Date(decodedData.exp * 1000),
//       });
//     })
//     .catch((error) => {
//       console.log("ERROR", error);
//       if (error.response?.status === 401) {
//         // logoutAction();
//       }
//     });
// };
