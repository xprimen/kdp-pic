import BukaUpdate from "@/components/Kotak/BukaView/BukaUpdate";
import PasangUpdate from "@/components/Kotak/PasangView/PasangUpdate";
import TopNavbar from "@/components/TopNavbar";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import React from "react";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar title="Pasang Kotak" backButton />
      {/* <EkspedisiUpdate id={Number(id)} /> */}
      <BukaUpdate id={Number(id)} />
    </AnimateSlideIn>
  );
};

export default Page;
