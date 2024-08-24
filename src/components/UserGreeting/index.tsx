import { LoginDataResponse } from "@/types";
import { Avatar, AvatarFallback } from "../ui/avatar";

type Props = {
  userdata: LoginDataResponse;
};
const UserGreeting = ({ userdata }: Props) => {
  return (
    <div className="flex items-center justify-between h-full px-4 py-4">
      <div className="flex-1 font-semibold">Hi, {userdata.nama}</div>
      <Avatar>
        <AvatarFallback className="text-white bg-primary">
          {userdata?.nama.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserGreeting;
