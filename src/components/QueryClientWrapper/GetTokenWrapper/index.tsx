"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
        }),
  });
  return <>{children}</>;
};

export default GetTokenWrapper;
