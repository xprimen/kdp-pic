import BottomNavbar from "@/components/BottomNavbar";
import TopNavbar from "@/components/TopNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <BottomNavbar role={userdata()?.role} />
      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="px-4">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password" className="px-4">
          Change your password here.
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Kotak;
