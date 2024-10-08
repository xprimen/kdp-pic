import TopNavbar from "@/components/TopNavbar";
import UserChangePassword from "@/components/UserChangePassword";
import { userdata } from "@/lib/utils-server";

const GantiPassword = () => {
  return (
    <>
      <TopNavbar backButton title="Ganti Password" />
      <UserChangePassword userdata={userdata()} />
    </>
  );
};

export default GantiPassword;
