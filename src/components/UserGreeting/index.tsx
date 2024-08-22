import { LoginDataResponse } from "@/types";
import React from "react";

type Props = {
  userdata: LoginDataResponse;
};
const UserGreeting = ({ userdata }: Props) => {
  return (
    <div className="flex items-center justify-center h-full px-4 py-4">
      <div className="flex-1 font-semibold">Hi, {userdata.nama}</div>
    </div>
  );
};

export default UserGreeting;
