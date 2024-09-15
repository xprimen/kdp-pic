import BottomNavbar from "@/components/BottomNavbar";
import KotakTabs from "@/components/Kotak/Tabs";
import TopNavbar from "@/components/TopNavbar";
import { userdata } from "@/lib/utils-server";

function Kotak() {
  return (
    <>
      <TopNavbar title="Kotak" />
      <BottomNavbar role={userdata().role} />
      <KotakTabs userdata={userdata()} />
    </>
  );
}

export default Kotak;
