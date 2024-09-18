"use client";

import { queryClient } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import GetTokenWrapper from "./GetTokenWrapper";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function QueryClientWrapper({
  children,
  refreshToken,
}: PropsWithChildren<{
  refreshToken: string | "";
}>) {
  return (
    // console.log("RT QCW : ", refreshToken);
    <QueryClientProvider client={queryClient}>
      <GetTokenWrapper refreshToken={refreshToken}>
        <div
          id="admin-main-content"
          className="my-0 mx-auto max-w-screen-sm bg-slate-50 min-h-screen"
        >
          {children}
        </div>
      </GetTokenWrapper>
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom"
        buttonPosition="relative"
      />
    </QueryClientProvider>
  );
}

export default QueryClientWrapper;
