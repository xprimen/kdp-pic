import SetorMultiKotak from "@/components/Kotak/SetorView/SetorMultiKotak";
import TopNavbar from "@/components/TopNavbar";
import React from "react";

const Page = () => {
  return (
    <>
      <TopNavbar title="Setor Banyak" backButton />
      <SetorMultiKotak />
    </>
  );
};

export default Page;
