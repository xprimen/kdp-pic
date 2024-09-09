import AdminClientWrapper from "@/components/AdminClientWrapper";
import React from "react";
import SecureWrapper from "./SecureWrapper";
import { cookies } from "next/headers";

type Props = {
  children: React.ReactNode;
};

function AdminLayout({ children }: Props) {
  const refreshToken = () => {
    return cookies().get("refreshToken")?.value || "";
  };
  return (
    <SecureWrapper refreshToken={refreshToken()}>
      <AdminClientWrapper>{children}</AdminClientWrapper>
    </SecureWrapper>
  );
}

export default AdminLayout;
