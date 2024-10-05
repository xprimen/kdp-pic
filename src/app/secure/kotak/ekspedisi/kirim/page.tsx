import EkspedisiKirim from "@/components/Kotak/EkspedisiView/EkspedisiKirim";
import EkspedisiUpdate from "@/components/Kotak/EkspedisiView/EkspedisiUpdate";
import TopNavbar from "@/components/TopNavbar";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";
import React from "react";

const Page = () => {
  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar title="Kirim Kotak" backButton />
      <EkspedisiKirim />
    </AnimateSlideIn>
  );
};

export default Page;
