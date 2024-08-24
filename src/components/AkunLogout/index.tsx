"use client";
import { logoutAction } from "@/lib/actions/login";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const AkunLogout = () => {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={(e) => {
        logoutAction();
        // router.push("/");
      }}
      className="mx-4 mt-4 uppercase bg-green-500 hover:bg-green-600 text-white hover:text-white border-0"
    >
      Logout
    </Button>
  );
};

export default AkunLogout;
