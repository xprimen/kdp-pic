"use client";
import { queryClient } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = {
  children: React.ReactNode;
};

import React from "react";

function SecureWrapper({ children }: Props) {
  // const router = useRouter();
  // React.useEffect(() => {
  //   if (!localStorage.getItem("userdata")) {
  //     router.replace("/");
  //   }
  // }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="relative" />
    </QueryClientProvider>
  );

  // return <>{children}</>;
}

export default SecureWrapper;
