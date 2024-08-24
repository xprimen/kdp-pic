"use client";
import { queryClient } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = {
  children: React.ReactNode;
};

import React from "react";

function SecureWrapper({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="relative" />
    </QueryClientProvider>
  );
}

export default SecureWrapper;
