"use client";
import { logoutAction, saveCookie } from "@/lib/actions/login";
import axiosInstance from "@/lib/axiosInstance";
import { decodeToken, queryClient } from "@/lib/utils";
import { LoginDataResponse } from "@/types";
import { QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getCookie, setCookie } from "cookies-next";
import React, { PropsWithChildren } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = {
  refreshToken: string;
};

function SecureWrapper({ children, refreshToken }: PropsWithChildren<Props>) {
  // console.log("isFetching 1 :", isFetching);
  // console.log("data :", data);
  // console.log("isFetching 2 :", isFetching);

  const getToken = queryClient.prefetchQuery({
    queryKey: ["token"],
    queryFn: () =>
      axios
        .get(`${process.env.BASE_API}/token`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        })
        .then((res) => {
          console.log("New Token :", res.data.accessToken);
          // console.log("TOKEN :", token);
          // console.log("RefreshToken :", refreshToken);
          // axiosInstance(res.data.accessToken);
          return res.data;
        }),
  });

  React.useEffect(() => {
    getToken;
  }, [getToken]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="relative" />
    </QueryClientProvider>
  );
}

export default SecureWrapper;
