import BukaEdit from "@/components/Kotak/BukaView/BukaEdit";
import PasangUpdate from "@/components/Kotak/PasangView/PasangUpdate";
import TopNavbar from "@/components/TopNavbar";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import React from "react";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar title="Edit Pasang Kotak" backButton />
      <BukaEdit id={Number(id)} />
    </AnimateSlideIn>
  );
};

export default Page;
