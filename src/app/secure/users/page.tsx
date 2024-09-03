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

  const token = () => {
    return String(cookies().get("token")?.value);
  };

  const getUsers = async () => {
    const response = await fetch(
      "https://json-server-tester.vercel.app/users",
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await response.json();
    const filterMawil = res.filter(
      (d: { mawil: string; role: number }) =>
        d.mawil === "sumsel" && [2, 3].includes(d.role)
    );
    return filterMawil;
  };

  return (
    <>
      <TopNavbar
        title="User PIC"
        // rightButtons={<RightButtonsTable add={{ link: "/secure/users/add" }} />}
      />
      <UserView token={token()} />
      <BottomNavbar role={userdata()?.role} />
    </>
  );
};

export default Users;
