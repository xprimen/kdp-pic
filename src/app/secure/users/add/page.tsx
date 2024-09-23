import TopNavbar from "@/components/TopNavbar";
import UserAdd from "@/components/UserAdd";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";

const Page = () => {
  const token = () => {
    return String(cookies().get("token")?.value);
  };

  const userdata = (): LoginDataResponse => {
    const data = cookies().get("userdata")?.value;
    return data ? JSON.parse(data) : null;
  };

  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar title="Tambah User PIC" backButton />
      <UserAdd userdata={userdata()} />
    </AnimateSlideIn>
  );
};

export default Page;
