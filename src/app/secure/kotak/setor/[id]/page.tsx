"use client";
import SetorSingleKotak from "@/components/Kotak/SetorView/SetorSingleKotak";
import TopNavbar from "@/components/TopNavbar";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import { useRouter } from "next/navigation";
import React from "react";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter();

  React.useLayoutEffect(() => {
    router.replace("/secure/kotak/setor");
  }, [router]);

  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar title="Setor Kotak" backButton />
      {/* <EkspedisiUpdate id={Number(id)} /> */}
      <SetorSingleKotak id={Number(id)} />
    </AnimateSlideIn>
  );
};

export default Page;
