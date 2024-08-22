import BottomNavbar from "@/components/BottomNavbar";
import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

function Kotak() {
  const userdata = (): LoginDataResponse => {
    const data = cookies().get("userdata")?.value;
    return data ? JSON.parse(data) : null;
  };

  return (
    <>
      <BottomNavbar role={userdata()?.role} />
      <h1>Kotak</h1>
      <Link href="/secure">Dashboard</Link>
    </>
  );
}

export default Kotak;
