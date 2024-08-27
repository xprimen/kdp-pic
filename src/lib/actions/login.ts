"use server";
import { LoginDataResponse, LoginFormInput } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logoutAction = () => {
  cookies().delete("token");
  cookies().delete("userdata");
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
    .then((res) => {
      let base64Url = res.data.accessToken.split(".")[1]; // token you get
      let base64 = base64Url.replace("-", "+").replace("_", "/");
      let decodedData = JSON.parse(
        Buffer.from(base64, "base64").toString("binary")
      );

      if (decodedData.role === "1") {
        return {
          success: false,
          message: "Login Gagal, User Tidak Memiliki Akses",
        };
      }

      const dataSave: LoginDataResponse = {
        role: String(decodedData.role),
        username: values.username,
        nama: decodedData.nama,
        id: decodedData.userid,
      };

      cookies().set("token", res.data.accessToken, {
        path: "/",
        httpOnly: true,
      });
      cookies().set("userdata", JSON.stringify(dataSave), {
        path: "/",
        httpOnly: true,
      });
      return {
        success: true,
        message: "Berhasil",
        data: dataSave,
      };
    });

  /* return await axios.get(`https://json-server-tester.vercel.app/users`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      // console.log("DATA JSON :", data);
      const dataFilter = data.filter((d: { role: number }) =>
        [2, 3].includes(d.role)
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

      const dataSave: LoginDataResponse = {
        role: filterByUsername[0].role,
        // username: filterByUsername[0].username,
        nama: filterByUsername[0].nama,
        id: filterByUsername[0].id,
      };

      cookies().set("token", filterByUsername[0].id, {
        path: "/",
        httpOnly: true,
      });
      // cookies().set("userdata", JSON.stringify(dataSave), {
      //   path: "/",
      //   httpOnly: true,
      // });
      return {
        success: true,
        message: "Berhasil",
        data: dataSave,
      };
    })
    .catch((error) => {
      return { success: false, message: "Error" };
    }); */
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
