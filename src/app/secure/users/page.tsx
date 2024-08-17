import BottomNavbar from "@/components/BottomNavbar";
import TopNavbar from "@/components/TopNavbar";
import UserView from "@/components/UserView";
import React from "react";

const Users = async () => {
  const getUsers = async () => {
    const response = await fetch(
      "https://json-server-tester.vercel.app/users",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await response.json();
    // console.log("ININININI :", res);
    return res;
  };

  return (
    <>
      <TopNavbar title="User PIC" />
      <BottomNavbar />
      <UserView data={await getUsers()} />
    </>
  );
};

export default Users;
