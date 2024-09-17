"use client";
import { BoxIcon, LayoutDashboard, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Label } from "../ui/label";

type TLinks = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const linksPW: TLinks[] = [
  {
    title: "Beranda",
    href: "/secure",
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: "PIC",
    href: "/secure/users",
    icon: <Users size={20} />,
  },
  {
    title: "Kotak",
    href: "/secure/kotak",
    icon: <BoxIcon size={20} />,
  },
  {
    title: "Akun",
    href: "/secure/akun",
    icon: <User size={20} />,
  },
];
const linksPK: TLinks[] = [
  {
    title: "Beranda",
    href: "/secure",
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: "Kotak",
    href: "/secure/kotak",
    icon: <BoxIcon size={20} />,
  },
  {
    title: "Akun",
    href: "/secure/akun",
    icon: <User size={20} />,
  },
];

type Props = {
  role: string;
};

const BottomNavbar = ({ role }: Props) => {
  const currentPath = usePathname();
  const links = role === "2" ? linksPW : linksPK;

  return (
    <div className="fixed w-full mx-auto z-10 bottom-0 max-w-screen-sm bg-slate-100 text-slate-600">
      <div className="flex items-center justify-center h-full">
        {links?.map((link) => (
          <Link
            replace
            key={link.title}
            href={link.href}
            className={`h-full w-full flex flex-col justify-center items-center p-2 space-y-1 ${
              currentPath === link.href ? "bg-slate-200 text-green-600" : ""
            }`}
          >
            {link.icon}
            <Label className="text-xs">{link.title}</Label>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
