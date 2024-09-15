import BottomNavbar from "@/components/BottomNavbar";
import TopNavbar from "@/components/TopNavbar";
import UserView from "@/components/UserView";
import { userdata } from "@/lib/utils-server";
import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";

const Users = () => {
  return (
    <>
      <TopNavbar
        title="User PIC"
        // rightButtons={<RightButtonsTable add={{ link: "/secure/users/add" }} />}
      />
      <UserView />
      <BottomNavbar role={userdata()?.role} />
    </>
  );
};

export default Users;
