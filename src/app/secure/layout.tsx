"use client";
import QueryClientWrapper from "@/components/QueryClientWrapper";
import { queryClient } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getCookie } from "cookies-next";
import React from "react";

type Props = {
  children: React.ReactNode;
};

// const refreshToken = () => {
//   "server only";
//   const headers = headers();
//   const cookieHeader = headers.get("Set-Cookie");
//   console.log(cookieHeader);
//   // return cookies().get("refreshToken")?.value || "";
// };

function AdminLayout({ children }: Props) {
  const refreshToken = getCookie("refreshToken") as string;
  // console.log("refresh token :", refreshToken);

  // Access individual cookies
  return (
    <QueryClientProvider client={queryClient}>
      <QueryClientWrapper refreshToken={refreshToken}>
        {children}
      </QueryClientWrapper>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="relative" />
    </QueryClientProvider>
  );
}

export default AdminLayout;
