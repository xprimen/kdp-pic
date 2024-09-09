import BottomNavbar from "@/components/BottomNavbar";
import TopNavbar from "@/components/TopNavbar";
import UserView from "@/components/UserView";
import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";

const Users = () => {
  const userdata = (): LoginDataResponse => {
    const data = cookies().get("userdata")?.value;
    return data ? JSON.parse(data) : null;
  };

  const token = (): string => {
    return cookies().get("token")?.value || "";
  };

  const refreshToken = (): string => {
    return cookies().get("refreshToken")?.value || "";
  };

  return (
    <>
      <TopNavbar
        title="User PIC"
        // rightButtons={<RightButtonsTable add={{ link: "/secure/users/add" }} />}
      />
      <UserView token={token()} refreshToken={refreshToken()} />
      <BottomNavbar role={userdata()?.role} />
    </>
  );
};

export default Users;
