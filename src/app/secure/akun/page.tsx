import AkunLogout from "@/components/AkunLogout";
import BottomNavbar from "@/components/BottomNavbar";
import TopNavbar from "@/components/TopNavbar";
import { Label } from "@/components/ui/label";
import UserInfo from "@/components/UserInfo";
import { LoginDataResponse } from "@/types";
import { ChevronRight, KeyRoundIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

const links = [
  {
    title: "Ganti Password",
    href: "/secure/akun/ganti-password",
    icon: <KeyRoundIcon />,
  },
];

const Akun = () => {
  const userdata = (): LoginDataResponse => {
    const data = cookies().get("userdata")?.value;
    return data ? JSON.parse(data) : null;
  };

  return (
    <>
      <TopNavbar title="Akun" />
      <BottomNavbar role={userdata()?.role} />
      <div className="flex flex-col">
        <UserInfo userdata={userdata()} />
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
        <AkunLogout />
      </div>
    </>
  );
};

export default Akun;
