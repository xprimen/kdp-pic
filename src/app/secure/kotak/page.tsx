import BottomNavbar from "@/components/BottomNavbar";
import KotakTabs from "@/components/Kotak/Tabs";
import TopNavbar from "@/components/TopNavbar";
import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";

function Kotak() {
  const userdata = (): LoginDataResponse => {
    const data = cookies().get("userdata")?.value;
    return data ? JSON.parse(data) : null;
  };

  return (
    <>
      <TopNavbar title="Kotak" />
      <BottomNavbar role={userdata().role} />
      <KotakTabs userdata={userdata()} />
    </>
  );
}

export default Kotak;
