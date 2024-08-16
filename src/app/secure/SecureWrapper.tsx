"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

import React from "react";

function SecureWrapper({ children }: Props) {
  const router = useRouter();
  React.useEffect(() => {
    if (!localStorage.getItem("userdata")) {
      router.replace("/");
    }
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="relative" />
    </QueryClientProvider>
  );
}

export default SecureWrapper;
