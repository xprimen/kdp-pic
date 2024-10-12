"use client";
import { LoginDataResponse, TUserProfile } from "@/types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/utils";
import { getUserProfile } from "@/lib/actions/users";

type Props = {
  userdata: LoginDataResponse;
};
const UserGreeting = ({ userdata }: Props) => {
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
    <div className="flex items-center justify-between h-full px-4 py-4">
      <div className="flex-1 font-semibold">Hi, {userProfile?.nama}</div>
      <Avatar>
        <AvatarFallback className="text-white bg-primary">
          {userProfile?.nama.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserGreeting;
