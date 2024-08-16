"use client";
import { BoxIcon, LayoutDashboard, User, Users } from "lucide-react";
import Link from "next/link";
import { Label } from "../ui/label";
import { usePathname } from "next/navigation";

const links = [
  {
    title: "Beranda",
    href: "/secure",
    icon: <LayoutDashboard />,
  },
  {
    title: "PIC",
    href: "/secure/users",
    icon: <Users />,
  },
  {
    title: "Kotak",
    href: "/secure/kotak",
    icon: <BoxIcon />,
  },
  {
    title: "Akun",
    href: "/secure/akun",
    icon: <User />,
  },
];

const BottomNavbar = () => {
  const currentPath = usePathname();

  return (
    <div className="fixed w-full mx-auto z-10 bottom-0 max-w-screen-sm bg-slate-100 text-slate-600">
      <div className="flex items-center justify-center h-full">
        {links.map((link) => (
          <Link
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