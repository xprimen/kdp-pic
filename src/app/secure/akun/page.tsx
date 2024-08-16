"use client";
import BottomNavbar from "@/components/BottomNavbar";
import TopNavbar from "@/components/TopNavbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { logoutAction } from "@/lib/actions/login";
import { LoginDataResponse } from "@/types";
import { ChevronRight, KeyRoundIcon, LucidePencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const links = [
  {
    title: "Ganti Password",
    href: "/secure/akun/ganti-password",
    icon: <KeyRoundIcon />,
  },
];

const Akun = () => {
  const router = useRouter();
  const userdata = (): LoginDataResponse | null => {
    const data = window.localStorage.getItem("userdata")!;
    return data ? JSON.parse(data) : null;
  };

  return (
    <>
      <TopNavbar title="Akun" />
      <BottomNavbar />
      <div className="flex flex-col">
        <div className="px-4 flex gap-x-4 min-h-24">
          <Avatar>
            <AvatarFallback className="text-white bg-primary">
              {userdata()?.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-bold text-xl">{userdata()?.name}</h2>
            <p className="text-slate-500 text-md">@{userdata()?.username}</p>
            <p className="text-green-600 text-md">
              {userdata()?.role === "PW" ? "PIC Wilayah" : "PIC Kotak"}
            </p>
          </div>
          <LucidePencil className="mr-4" />
        </div>
        {links.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="p-4 border-b hover:bg-slate-200 flex items-center gap-4"
          >
            {link.icon}
            <Label className="flex-1">{link.title}</Label>
            <ChevronRight className="self-end" />
          </Link>
        ))}
        <Button
          variant="outline"
          onClick={(e) => {
            localStorage.removeItem("userdata");
            logoutAction();
            router.replace("/");
          }}
          className="mx-4 mt-4 uppercase bg-green-500 hover:bg-green-600 text-white border-0"
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default Akun;
