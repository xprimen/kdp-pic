"use client";
import { userdata } from "@/components/utilities/Userdata";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import React from "react";
import BukaView from "../BukaView";
import EkspedisiView from "../EkspedisiView";
import PasangView from "../PasangView";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { LoginDataResponse } from "@/types";
import SetorView from "../SetorView";

type Props = {
  userdata: LoginDataResponse;
};

const KotakTabs = ({ userdata }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return router.push(pathname + "?" + params.toString());
    },
    [pathname, router, searchParams]
  );

  const tabParams = searchParams.get("tab");
  const tab = tabParams ? tabParams : "ekspedisi";
  const gridCols = () => {
    return userdata.role === "2" ? "grid-cols-4" : "grid-cols-3";
  };
  return (
    <Tabs defaultValue={tab}>
      <TabsList className={`grid w-full ${gridCols()} bg-slate-100 h-14`}>
        {userdata.role === "2" && (
          <TabsTrigger
            onClick={() => createQueryString("tab", "ekspedisi")}
            value="ekspedisi"
            className="h-full text-md"
          >
            Terima/Kirim
          </TabsTrigger>
        )}
        <TabsTrigger
          onClick={() => createQueryString("tab", "pasang")}
          value="pasang"
          className="h-full text-md"
        >
          Pasang
        </TabsTrigger>
        <TabsTrigger
          onClick={() => createQueryString("tab", "buka")}
          value="buka"
          className="h-full text-md"
        >
          Buka
        </TabsTrigger>
        <TabsTrigger
          onClick={() => createQueryString("tab", "setor")}
          value="setor"
          className="h-full text-md"
        >
          Setor
        </TabsTrigger>
      </TabsList>
      {userdata.role === "2" && (
        <TabsContent value="ekspedisi" asChild>
          <EkspedisiView />
        </TabsContent>
      )}
      <TabsContent value="pasang" asChild>
        <PasangView />
      </TabsContent>
      <TabsContent value="buka" asChild>
        <BukaView />
      </TabsContent>
      <TabsContent value="setor" asChild>
        <SetorView />
      </TabsContent>
    </Tabs>
  );
};

export default KotakTabs;
