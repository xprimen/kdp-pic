"use client";
import { queryClient } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { PropsWithChildren, useCallback } from "react";

const GetTokenWrapper = ({
  children,
  refreshToken,
}: PropsWithChildren<{ refreshToken?: string | "" }>) => {
  // const getPrefetchToken = React.useCallback(
  //   () => async () =>
  //     await queryClient.prefetchQuery({
  //       queryKey: ["token"],
  //       queryFn: async () => {
  //         return await axios
  //           .get(`${process.env.BASE_API}/token`, {
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${refreshToken}`,
  //             },
  //           })
  //           .then((res) => {
  //             console.log("New Token Client :", res);
  //             // console.log("TOKEN :", token);
  //             // console.log("RefreshToken :", refreshToken);
  //             // axiosInstance(res.data.accessToken);
  //             return res.data;
  //           })
  //           .catch((err) => {
  //             console.log("ERROR GET TOKEN :", err);
  //           });
  //       },
  //     }),
  //   [refreshToken]
  // );

  // React.useEffect(() => {
  //   getPrefetchToken();
  // }, [getPrefetchToken]);

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
          // console.log("New Token Client :", res);
          // console.log("TOKEN :", token);
          // console.log("RefreshToken :", refreshToken);
          // axiosInstance(res.data.accessToken);
          return res.data;
        })
        .catch((err) => {
          console.log("ERROR GET TOKEN :", err);
        }),
  });
  return <>{children}</>;
};

export default GetTokenWrapper;
