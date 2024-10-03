import BottomNavbar from "@/components/BottomNavbar";
import TopNavbar from "@/components/TopNavbar";
import UserView from "@/components/UserView";
import { userdata } from "@/lib/utils-server";

const Users = () => {
  return (
    <>
      <TopNavbar title="User PIC" />
      <UserView />
      <BottomNavbar role={userdata()?.role} />
    </>
  );
};

export default Users;
