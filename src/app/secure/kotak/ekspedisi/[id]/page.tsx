import EkspedisiUpdate from "@/components/Kotak/EkspedisiUpdate";
import TopNavbar from "@/components/TopNavbar";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";
import React from "react";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar title="Penerimaan Kotak" backButton />
      <EkspedisiUpdate id={Number(id)} />
    </AnimateSlideIn>
  );
};

export default Page;
