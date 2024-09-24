"use client";
import { logoutAction } from "@/lib/actions/login";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { PropsWithChildren } from "react";

const GetTokenWrapper = ({
  children,
  refreshToken,
}: PropsWithChildren<{ refreshToken?: string | "" }>) => {
  useQuery({
    queryKey: ["token"],
    refetchInterval: 1000 * 10,
    queryFn: async () =>
      await axios
        .get(`${process.env.BASE_API}/token`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 403) {
            logoutAction();
          }
        }),
  });
  return <>{children}</>;
};

export default GetTokenWrapper;
