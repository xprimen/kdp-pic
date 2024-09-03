import BottomNavbar from "@/components/BottomNavbar";
import BukaView from "@/components/Kotak/BukaView";
import PasangView from "@/components/Kotak/PasangView";
import EkspedisiView from "@/components/Kotak/EkspedisiView";
import TopNavbar from "@/components/TopNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";

function Kotak() {
  const userdata = (): LoginDataResponse => {
    const data = cookies().get("userdata")?.value;
    return data ? JSON.parse(data) : null;
  };

  const token = () => {
    return String(cookies().get("token")?.value);
  };

  const gridCols = () => {
    return userdata().role === "2" ? "grid-cols-3" : "grid-cols-2";
  };

  return (
    <>
      <TopNavbar title="Kotak" />
      <BottomNavbar role={userdata()?.role} />
      <Tabs defaultValue="ekspedisi">
        <TabsList className={`grid w-full ${gridCols()} bg-slate-100 h-14`}>
          {userdata().role === "2" && (
            <TabsTrigger value="ekspedisi" className="h-full text-md">
              Terima/Kirim
            </TabsTrigger>
          )}
          <TabsTrigger value="pasang" className="h-full text-md">
            Pasang
          </TabsTrigger>
          <TabsTrigger value="buka" className="h-full text-md">
            Buka
          </TabsTrigger>
        </TabsList>
        {userdata().role === "2" && (
          <TabsContent value="ekspedisi" asChild>
            <EkspedisiView userdata={userdata()} token={token()} />
          </TabsContent>
        )}
        <TabsContent value="pasang" asChild>
          <PasangView userdata={userdata()} token={token()} />
        </TabsContent>
        <TabsContent value="buka" asChild>
          <BukaView userdata={userdata()} />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Kotak;
