"use client";
import { queryClient } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import axios, { AxiosError } from "axios";

type Props = {
  children: React.ReactNode;
  token: string;
};

import React from "react";
import { logoutAction } from "@/lib/actions/login";

function SecureWrapper({ children, token }: Props) {
  const refreshing = React.useCallback(
    async (token: string, error: AxiosError) => {
      console.log("tes sdsds", token);
      return await axios
        .get(`https://apifk.rurosi.my.id/token`, {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        })
        .then(async ({ data }) => {
          console.log("response :", data);
          // console.log("SESSION LAMA :", {
          //   token: old_token,
          //   refresh_token: bearer,
          // });
          // console.log("SESSION BARU :", {
          //   token: resData.data.token,
          //   refresh_token: resData.data.refresh_token,
          // });

          // await update({
          //   ...session?.user,
          //   token: resData.data.token,
          //   refresh_token: resData.data.refresh_token,
          // }).then(() => console.log("BERHASIL UPDATE SESSION"));
          // if (error.config) {
          //   error.config.headers.Authorization = `Bearer ${resData.token}`;
          // }
          // return Promise.resolve();
        })
        .catch((error) => {
          console.log("ERROR", error);
          if (error.response?.status === 401) {
            // logoutAction();
          }
        });
      /* try {
        return await axios
          .get(`https://apifk.rurosi.my.id/token`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then(async ({ data }) => {
            console.log("response :", data);
            // console.log("SESSION LAMA :", {
            //   token: old_token,
            //   refresh_token: bearer,
            // });
            // console.log("SESSION BARU :", {
            //   token: resData.data.token,
            //   refresh_token: resData.data.refresh_token,
            // });

            // await update({
            //   ...session?.user,
            //   token: resData.data.token,
            //   refresh_token: resData.data.refresh_token,
            // }).then(() => console.log("BERHASIL UPDATE SESSION"));
            // if (error.config) {
            //   error.config.headers.Authorization = `Bearer ${resData.token}`;
            // }
            // return Promise.resolve();
          });
      } catch (error) {
        // console.log("ERROR", error);
        return Promise.reject(error);
      } */
    },
    []
  );

  React.useEffect(() => {
    createAuthRefreshInterceptor(
      axios,
      async (error: AxiosError) => {
        return refreshing(token, error);
        // console.log("tes return");
      },
      {
        statusCodes: [403],
      }
    );
    // console.log("tes :", token);
  }, [refreshing, token]);

  /* const slashToken = async () => {
    const token = await axios
      .get(`https://apifk.rurosi.my.id/token`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("RESPON TOKEN :", res);
      });
  };
  React.useEffect(() => {
    slashToken();
  }, []); */

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="relative" /> */}
    </QueryClientProvider>
  );
}

export default SecureWrapper;
