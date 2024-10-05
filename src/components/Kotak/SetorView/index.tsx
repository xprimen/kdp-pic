"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getKotakSetor } from "@/lib/actions/kotak";
import { numberToString, queryClient } from "@/lib/utils";
import { statusKotakBGColor, TKotakSetor } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Box, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SetorView = () => {
  const [kotakBelumSetor, setKotakBelumSetor] = useState<TKotakSetor[]>([]);
  const { data, isFetching } = useQuery({
    queryKey: ["historyKotakSetor"],
    queryFn: async (): Promise<TKotakSetor[]> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const get = await getKotakSetor(accessToken);
      setKotakBelumSetor(get.filter((item) => item.id_status_kotak === 3));
      return get;
    },
  });

  return (
    <div className="mb-20">
      <div className="px-4 pt-4 flex">
        <Link
          href={
            kotakBelumSetor && kotakBelumSetor.length > 0
              ? "/secure/kotak/setor"
              : ""
          }
          className="w-full py-6 uppercase text-white text-lg bg-green-600 flex items-center justify-center rounded-lg shadow-md hover:bg-green-800"
        >
          <CreditCard className="mr-2" />
          <span>Setor Kotak</span>
        </Link>
      </div>
      <div className="flex flex-col gap-2 my-4">
        {isFetching &&
          [...Array(10)].map((_, i) => (
            <div key={i} className="bg-white px-4 py-2">
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-lg flex items-center gap-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-slate-500 text-sm flex justify-between">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        {data?.map((dt: TKotakSetor) => (
          <Card
            key={dt.id}
            className={`mx-4 ${statusKotakBGColor[dt.id_status_kotak]}`}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-lg flex items-center space-x-4 justify-between">
                <div className="flex items-center space-x-4">
                  <Box size="20" />
                  <span>{dt.kode_kotak}</span>
                </div>
                <div className="flex items-center space-x-2 font-semibold text-lg">
                  <span>Rp</span>
                  <span>{numberToString(Number(dt.pendapatan_kotak))}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="text-sm flex justify-between pt-4">
              <div className="flex flex-col items-center space-x-2">
                <span className="text-sm font-bold">Pasang</span>
                <span className={`text-sm capitalize border rounded-lg px-3`}>
                  {dt.tgl_start &&
                    new Intl.DateTimeFormat("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(dt.tgl_start))}
                </span>
              </div>
              <div className="flex flex-col items-center space-x-2">
                <span className="text-sm font-bold">Buka</span>
                <span className={`text-sm capitalize border rounded-lg px-3`}>
                  {dt.tgl_stop &&
                    new Intl.DateTimeFormat("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(dt.tgl_stop))}
                </span>
              </div>
              {dt.setor?.tgl_setor && (
                <div className="flex flex-col items-center space-x-2">
                  <span className="text-sm font-bold">Setor</span>
                  <span className={`text-sm capitalize border rounded-lg px-3`}>
                    {new Intl.DateTimeFormat("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(dt.setor.tgl_setor))}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SetorView;
