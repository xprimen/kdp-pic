import SetorMultiKotak from "@/components/Kotak/SetorView/SetorMultiKotak";
import TopNavbar from "@/components/TopNavbar";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import React from "react";

const Page = () => {
  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar title="Setor Banyak" backButton />
      <SetorMultiKotak />
    </AnimateSlideIn>
  );
};

export default Page;
