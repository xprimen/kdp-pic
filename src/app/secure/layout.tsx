import QueryClientWrapper from "@/components/QueryClientWrapper";
import { getRefreshToken } from "@/lib/utils-server";
import React from "react";

type Props = {
  children: React.ReactNode;
};

function AdminLayout({ children }: Props) {
  const refreshToken = getRefreshToken() || "";

  // Access individual cookies
  return (
    <QueryClientWrapper refreshToken={refreshToken}>
      {children}
    </QueryClientWrapper>
  );
}

export default AdminLayout;
