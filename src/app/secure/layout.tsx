import AdminClientWrapper from "@/components/AdminClientWrapper";
import React from "react";
import SecureWrapper from "./SecureWrapper";

type Props = {
  children: React.ReactNode;
};

function AdminLayout({ children }: Props) {
  return (
    <SecureWrapper>
      <AdminClientWrapper>{children}</AdminClientWrapper>
    </SecureWrapper>
  );
}

export default AdminLayout;
