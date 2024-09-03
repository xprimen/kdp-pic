import EkspedisiUpdate from "@/components/Kotak/EkspedisiUpdate";
import TopNavbar from "@/components/TopNavbar";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";
import React from "react";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  const userdata = (): LoginDataResponse => {
    const data = cookies().get("userdata")?.value;
    return data ? JSON.parse(data) : null;
  };

  const token = () => {
    return String(cookies().get("token")?.value);
  };

  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar title="Penerimaan Kotak" backButton />
      <EkspedisiUpdate id={Number(id)} token={token()} userdata={userdata()} />
    </AnimateSlideIn>
  );
};

export default Page;
