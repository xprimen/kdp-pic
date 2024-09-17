"use client";
import QRCodeScanner from "@/components/QRCodeScanner";
import { toast } from "@/components/ui/use-toast";
import { getKotak } from "@/lib/actions/kotak";
import { queryClient } from "@/lib/utils";
import { TKotak } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  const [kodeScanner, setKodeScanner] = React.useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["kotakTerpasang"],
    queryFn: async (): Promise<TKotak[]> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const data = await getKotak(accessToken);
      const filterIdle = data.filter((dt: TKotak) => dt.id_status_kotak === 2);
      return filterIdle;
    },
    // refetchOnWindowFocus: true,
  });

  const checkKode = (kode: string, kotak: TKotak[]) => {
    if (kode && kotak) {
      const kotakFilter: TKotak[] = kotak.filter(
        (dt: TKotak) => dt.id_kotak === kode
      );
      if (kotakFilter.length === 1) {
        redirect(`/secure/kotak/buka/${kotakFilter[0].id}`);
      } else {
        toast({
          title: "Informasi",
          description: "Kode Kotak Tidak Ditemukan",
        });
        redirect("/secure/kotak?tab=pasang");
      }
    }
  };

  React.useEffect(() => {
    if (data) checkKode(kodeScanner, data);
  }, [data, kodeScanner]);

  return (
    <>
      <QRCodeScanner setValue={setKodeScanner} />
    </>
  );
};

export default Page;
