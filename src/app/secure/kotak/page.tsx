import BottomNavbar from "@/components/BottomNavbar";
import Link from "next/link";
import React from "react";

function Kotak() {
  return (
    <>
      <BottomNavbar />
      <h1>Kotak</h1>
      <Link href="/secure">Dashboard</Link>
    </>
  );
}

export default Kotak;
