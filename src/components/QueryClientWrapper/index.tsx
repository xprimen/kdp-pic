"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { PropsWithChildren } from "react";

interface Props {
  refreshToken: string;
}

function QueryClientWrapper({
  children,
  refreshToken,
}: PropsWithChildren<Props>) {
  useQuery({
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
          console.log("New Token Client :", res.data.accessToken);
          // console.log("TOKEN :", token);
          // console.log("RefreshToken :", refreshToken);
          // axiosInstance(res.data.accessToken);
          return res.data;
        })
        .catch((err) => {
          console.log("ERROR GET TOKEN :", err);
        }),
  });

  return (
    <div
      id="admin-main-content"
      className="my-0 mx-auto max-w-screen-sm bg-slate-50 min-h-screen"
    >
      {children}
    </div>
  );
}

export default QueryClientWrapper;
