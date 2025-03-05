import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getKotak, getKotakSetor } from "@/lib/actions/kotak";
import { queryClient } from "@/lib/utils";
import { TKotak, TKotakSetor } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Box } from "lucide-react";

const TotalKotak = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["kotakDashboard"],
    queryFn: async (): Promise<{
      total: number;
      belumSetor: number;
      terpasang: number;
      idle: number;
    }> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const data = await getKotak(accessToken);
      const kotakTerpasang = data.filter(
        (dt: TKotak) => dt.id_status_kotak === 2
      );
      const kotakIdle = data.filter((dt: TKotak) => dt.id_status_kotak === 1);

      let kotakBelumSetor = (await getKotakSetor(accessToken)) as TKotakSetor[];
      kotakBelumSetor = kotakBelumSetor.filter(
        (dt: TKotakSetor) => dt.id_status_kotak === 3
      );

      const totalKotak = kotakIdle.length + kotakTerpasang.length;

      return {
        total: totalKotak,
        terpasang: kotakTerpasang.length,
        idle: kotakIdle.length,
        belumSetor: kotakBelumSetor.length,
      };
    },
    refetchOnMount: true,
  });

  return (
    <Card x-chunk="dashboard-05-chunk-2" className="relative">
      <Box className="absolute text-slate-300 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
      <CardHeader className="pb-2">
        <CardDescription>Total Kotak</CardDescription>
        {isFetching ? (
          <CardTitle className="flex items-center">
            <Skeleton className="w-32 h-8" />
          </CardTitle>
        ) : (
          <CardTitle className="text-4xl">{data?.total} Kotak</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground flex items-center space-x-1">
          <div className="text-blue-600 flex items-center space-x-1 border-r-black/50 border-r pr-2">
            {isFetching ? (
              <Skeleton className="w-8 h-4" />
            ) : (
              <span>{data?.idle}</span>
            )}
            <span>Idle</span>
          </div>
          <div className="text-green-600 flex items-center space-x-1 border-r-black/50 border-r pr-2">
            {isFetching ? (
              <Skeleton className="w-8 h-4" />
            ) : (
              <span>{data?.terpasang}</span>
            )}
            <span>Terpasang</span>
          </div>
          <div className="text-red-600 flex items-center space-x-1">
            {isFetching ? (
              <Skeleton className="w-8 h-4" />
            ) : (
              <span>{data?.belumSetor}</span>
            )}
            <span>Pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalKotak;
