"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import TableToolbars from "@/components/utilities/TableToolbars";
import { getKotakSetor } from "@/lib/actions/kotak";
import { numberToString, queryClient } from "@/lib/utils";
import { TKotakSetor } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Box, Boxes } from "lucide-react";
import Link from "next/link";

const SetorView = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["kotakIdle"],
    queryFn: async (): Promise<TKotakSetor[]> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const data = await getKotakSetor(accessToken);
      return data;
    },
  });

  return (
    <div className="mb-20">
      <TableToolbars
      // add={{
      //   link: "/secure/kotak/pasang/scan",
      //   label: "Setor Banyak Kotak",
      //   variant: "default",
      //   icon: <Boxes className="w-4 h-4" />,
      // }}
      />
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
          <Link
            href={`/secure/kotak/setor/${dt.id}`}
            key={dt.id}
            className="bg-white px-4 py-2"
          >
            <Card>
              <CardHeader className="py-6">
                <CardTitle className="text-lg flex items-center space-x-4 justify-between">
                  <div className="flex items-center space-x-4">
                    <Box size="20" />
                    <span>{dt.kode_kotak}</span>
                  </div>
                  <div>
                    <span className="text-sm">Pasang :</span>
                    <span
                      className={`text-sm capitalize bg-slate-100 text-slate-600 rounded-lg px-3`}
                    >
                      {new Intl.DateTimeFormat("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(dt.tgl_start))}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="text-sm flex justify-between pt-4">
                <div className="flex items-center space-x-2 font-semibold text-lg">
                  <span>Rp</span>
                  <span>{numberToString(Number(dt.pendapatan_kotak))}</span>
                </div>
                <div>
                  <span className="text-sm">Buka :</span>
                  <span
                    className={`text-sm capitalize bg-slate-100 text-slate-600 rounded-lg px-3`}
                  >
                    {new Intl.DateTimeFormat("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(dt.tgl_stop))}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SetorView;
