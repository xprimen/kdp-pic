import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";

export const userdata = (): LoginDataResponse => {
  const data = cookies().get("userdata")?.value;
  return data ? JSON.parse(data) : null;
};

export const getRefreshToken = () => {
  const refreshToken = cookies().get("refreshToken")?.value;
  return refreshToken;
};

export const getAccessToken = () => {
  return cookies().get("token")?.value;
};
