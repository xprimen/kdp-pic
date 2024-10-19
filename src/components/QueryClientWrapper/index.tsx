"use client";

import { queryClient } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";
import GetTokenWrapper from "./GetTokenWrapper";

function QueryClientWrapper({
  children,
  refreshToken,
}: PropsWithChildren<{
  refreshToken: string | "";
}>) {
  return (
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
        position="left"
        buttonPosition="relative"
      />
    </QueryClientProvider>
  );
}

export default QueryClientWrapper;
