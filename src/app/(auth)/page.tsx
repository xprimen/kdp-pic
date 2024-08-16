import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Image
        src="/assets/logo-kdp.png"
        alt="logo"
        width={200}
        height={200}
        priority
        className="rounded-full w-32 h-32 bg-white drop-shadow-xl"
      />
      <LoginForm />
    </div>
  );
};

export default Page;
