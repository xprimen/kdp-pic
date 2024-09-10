"use client";
import { userdata } from "@/components/utilities/Userdata";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import React from "react";
import BukaView from "../BukaView";
import EkspedisiView from "../EkspedisiView";
import PasangView from "../PasangView";
import { useParams, useSearchParams } from "next/navigation";
import { LoginDataResponse } from "@/types";

type Props = {
  userdata: LoginDataResponse;
};

const KotakTabs = ({ userdata }: Props) => {
  const params = useSearchParams();
  const tabParams = params.get("tab");
  const tab = tabParams ? tabParams : "ekspedisi";
  const gridCols = () => {
    return userdata.role === "2" ? "grid-cols-3" : "grid-cols-2";
  };
  return (
    <Tabs defaultValue={tab}>
      <TabsList className={`grid w-full ${gridCols()} bg-slate-100 h-14`}>
        {userdata.role === "2" && (
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
      {userdata.role === "2" && (
        <TabsContent value="ekspedisi" asChild>
          <EkspedisiView userdata={userdata} />
        </TabsContent>
      )}
      <TabsContent value="pasang" asChild>
        <PasangView userdata={userdata} />
      </TabsContent>
      <TabsContent value="buka" asChild>
        <BukaView userdata={userdata} />
      </TabsContent>
    </Tabs>
  );
};

export default KotakTabs;
