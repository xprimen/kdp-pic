import AdminClientWrapper from "@/components/AdminClientWrapper";
import React from "react";
import SecureWrapper from "./SecureWrapper";
import { cookies } from "next/headers";

type Props = {
  children: React.ReactNode;
};

function AdminLayout({ children }: Props) {
  const token = () => {
    return String(cookies().get("token")?.value);
  };

  return (
    <SecureWrapper token={token()}>
      <AdminClientWrapper>{children}</AdminClientWrapper>
    </SecureWrapper>
  );
}

export default AdminLayout;
