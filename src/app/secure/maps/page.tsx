import TopNavbar from "@/components/TopNavbar";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import React from "react";

const page = () => {
  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar title="Peta Kotak" backButton />
      <div>Peta</div>
    </AnimateSlideIn>
  );
};

export default page;
