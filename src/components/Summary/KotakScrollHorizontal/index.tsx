import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getKotak } from "@/lib/actions/kotak";
import { queryClient } from "@/lib/utils";
import { TKotak } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, MapPin, User, UserCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const KotakScrollHorizontal = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["kotak"],
    queryFn: async (): Promise<TKotak[]> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const data = await getKotak(accessToken);
      // const filterIdle = data.filter(
      //   (dt: TKotak) => dt.id_status_kotak === 1 || dt.id_status_kotak === 3
      // );
      return data;
    },
    // refetchOnWindowFocus: true,
  });

  return (
    <div className="flex flex-col py-4">
      <div className="flex justify-between px-4">
        <h2 className="font-semibold px-4">Kotak</h2>
        <Link href="/secure/kotak?tab=pasang" className="flex items-center">
          <span>Detail</span> <ChevronRight className="text-slate-500" />
        </Link>
      </div>
      <ScrollArea className="whitespace-nowrap">
        <div className="flex space-x-4 p-4">
          {isFetching &&
            [...Array(5)].map((_, i) => (
              <Card key={i} className={`w-72 `}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-x-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-full" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-slate-500 gap-x-2 text-sm flex justify-between">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          {data &&
            data.map((kotak, i) => (
              <Card
                key={i}
                className={`w-72 ${
                  kotak.id_status_kotak === 2
                    ? "bg-green-600 text-white"
                    : kotak.id_status_kotak === 3
                    ? "bg-red-600 text-white"
                    : ""
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex text-lg justify-between items-center">
                    <span>Kotak {kotak.id_kotak}</span>
                    {kotak.id_status_kotak === 2 && (
                      <Link
                        href="/secure/maps"
                        className="bg-rose-700 rounded-full text-white p-2 text-xs"
                      >
                        <MapPin className="w-6 h-6" />
                      </Link>
                    )}
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col pt-4">
                  <div className="flex gap-x-2">
                    <UserCircle /> {kotak.PkUser?.nama || kotak.PwUser?.nama}
                  </div>
                  {kotak.id_status_kotak === 3 && <div>Rp 1.000.000</div>}
                </CardContent>
              </Card>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default KotakScrollHorizontal;
