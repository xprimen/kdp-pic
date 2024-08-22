import { LoginDataResponse } from "@/types";
import { LucidePencil } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  userdata: LoginDataResponse | null;
};
const UserInfo = ({ userdata }: Props) => {
  return (
    <div className="px-4 flex gap-x-4 min-h-24">
      <Avatar>
        <AvatarImage src="/assets/logo-kdp.png" />
        <AvatarFallback className="text-white bg-primary">
          {userdata?.nama.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="font-bold text-xl">{userdata?.nama}</h2>
        <p className="text-slate-500 text-md">@{userdata?.username}</p>
        <p className="text-green-600 text-md">
          {userdata?.role === 2 ? "PIC Wilayah" : "PIC Kotak"}
        </p>
      </div>
      <LucidePencil className="mr-4" />
    </div>
  );
};

export default UserInfo;
