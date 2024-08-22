import UserAdd from "@/components/UserAdd";
import { cookies } from "next/headers";

const Page = () => {
  const token = () => {
    return String(cookies().get("token")?.value);
  };

  return <UserAdd token={token()} />;
};

export default Page;
