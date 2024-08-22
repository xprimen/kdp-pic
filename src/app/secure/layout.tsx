import React from "react";
import SecureWrapper from "./SecureWrapper";
import AdminClientWrapper from "@/components/AdminClientWrapper";
import BottomNavbar from "@/components/BottomNavbar";
import { cookies } from "next/headers";
import { LoginDataResponse } from "@/types";

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
