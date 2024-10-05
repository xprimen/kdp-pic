"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import BukaView from "../BukaView";
import EkspedisiView from "../EkspedisiView";
import PasangView from "../PasangView";
import SetorView from "../SetorView";

const KotakTabs = () => {
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
  return (
    <Tabs defaultValue={tab}>
      <TabsList className={`grid w-full grid-cols-4 bg-slate-100 h-14`}>
        <TabsTrigger
          onClick={() => createQueryString("tab", "ekspedisi")}
          value="ekspedisi"
          className="h-full text-sm"
        >
          Terima / Kirim
        </TabsTrigger>
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
      <TabsContent value="ekspedisi" asChild>
        <EkspedisiView />
      </TabsContent>
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
