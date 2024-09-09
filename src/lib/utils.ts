import { QueryCache, QueryClient } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryClient = new QueryClient();

export const queryCache = new QueryCache({
  onError: (error) => {
    console.log(error);
  },
  onSuccess: (data) => {
    console.log(data);
  },
  onSettled: (data, error) => {
    console.log(data, error);
  },
});

export function decodeToken<T>(
  token: string
): T & { iat: number; exp: number } {
  let base64Url = token.split(".")[1]; // token you get
  let base64 = base64Url.replace("-", "+").replace("_", "/");
  let decodedData = JSON.parse(
    Buffer.from(base64, "base64").toString("binary")
  );

  return decodedData;
}
