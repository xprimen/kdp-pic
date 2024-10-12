"use client";
import { getUserProfile } from "@/lib/actions/users";
import { queryClient } from "@/lib/utils";
import { LoginDataResponse, TUserProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "../ui/avatar";

type Props = {
  userdata: LoginDataResponse;
};
const UserInfo = ({ userdata }: Props) => {
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const userProfile = (await getUserProfile(
        accessToken,
        userdata.id
      )) as TUserProfile;
      return userProfile;
    },
  });

  return (
    <div className="px-4 flex gap-x-4 min-h-24">
      <Avatar className="w-16 h-16">
        <AvatarFallback className="text-white bg-primary text-xl">
          {userdata?.nama.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="font-bold text-xl">{userProfile?.nama}</h2>
        <p className="text-slate-500 text-md">@{userProfile?.username}</p>
        <p className="text-green-600 text-md">
          {userProfile?.role.role === "PW" ? "PIC Wilayah" : "PIC Kotak"}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
