import BottomNavbar from "@/components/BottomNavbar";
import Summary from "@/components/Summary";
import UserGreeting from "@/components/UserGreeting";
import { userdata } from "@/lib/utils-server";

function Dashboard() {
  return (
    <div className="pb-20">
      <BottomNavbar role={userdata().role} />
      <UserGreeting userdata={userdata()} />
      <Summary userdata={userdata()} />
    </div>
  );
}

export default Dashboard;
