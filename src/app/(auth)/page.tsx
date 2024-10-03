"use client";
import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <Image src="/assets/logo.png" width={120} height={120} alt="Logo KDP" />
      <LoginForm />
    </div>
  );
};

export default Page;
