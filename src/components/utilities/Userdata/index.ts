"use server";
import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";

export const userdata = (): LoginDataResponse => {
  const data = cookies().get("userdata")?.value;
  return data ? JSON.parse(data) : null;
};
