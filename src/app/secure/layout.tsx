import QueryClientWrapper from "@/components/QueryClientWrapper";
import { getRefreshToken } from "@/lib/utils-server";
import React from "react";

type Props = {
  children: React.ReactNode;
};

// const refreshToken = () => {
//   "server only";
//   const headers = headers();
//   const cookieHeader = headers.get("Set-Cookie");
//   console.log(cookieHeader);
//   // return cookies().get("refreshToken")?.value || "";
// };

function AdminLayout({ children }: Props) {
  const refreshToken = getRefreshToken() || "";
  // console.log("refresh token :", refreshToken);

  // Access individual cookies
  return (
    <QueryClientWrapper refreshToken={refreshToken}>
      {children}
    </QueryClientWrapper>
  );
}

export default AdminLayout;
