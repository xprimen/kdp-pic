import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";

export const userdata = (): LoginDataResponse => {
  const data = cookies().get("userdata")?.value;
  return data ? JSON.parse(data) : null;
  // return {
  //   id: "1",
  //   role: "2",
  //   mawil: "2",
  //   nama: "Engga",
  //   submawil: "1",
  // };
};
