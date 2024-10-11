import TopNavbar from "@/components/TopNavbar";
import UserProfile from "@/components/UserProfile";
import { userdata } from "@/lib/utils-server";

const Page = () => {
  return (
    <>
      <TopNavbar backButton title="Data Profil" />
      <UserProfile userdata={userdata()} />
    </>
  );
};

export default Page;
