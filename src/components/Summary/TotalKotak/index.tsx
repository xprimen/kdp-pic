import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getKotak } from "@/lib/actions/kotak";
import { queryClient } from "@/lib/utils";
import { TKotak } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Box, LoaderIcon } from "lucide-react";

const TotalKotak = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["total-kotak"],
    queryFn: async (): Promise<{
      idle: number;
      terpasang: number;
      belumSetor: number;
      total: number;
    }> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      let ret = {
        total: 0,
        idle: 0,
        terpasang: 0,
        belumSetor: 0,
      };
      const data = await getKotak(accessToken);
      const filterIdle = data.filter((dt: TKotak) => dt.id_status_kotak === 1);
      const filterTerpasang = data.filter(
        (dt: TKotak) => dt.id_status_kotak === 2
      );
      const filterBelumSetor = data.filter(
        (dt: TKotak) => dt.id_status_kotak === 3
      );

      ret = {
        idle: filterIdle.length,
        terpasang: filterTerpasang.length,
        belumSetor: filterBelumSetor.length,
        total: data.length,
      };

      return ret;
    },
  });

  return (
    <Card x-chunk="dashboard-05-chunk-2" className="relative">
      <Box className="absolute text-slate-300 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
      <CardHeader className="pb-2">
        <CardDescription>Total Kotak</CardDescription>
        {isFetching ? (
          <CardTitle className="flex items-center">
            <LoaderIcon className="mr-2 animate-spin" /> Loading...
          </CardTitle>
        ) : (
          <CardTitle className="text-4xl">{data?.total} Kotak</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground flex items-center space-x-1">
          <div className="text-blue-600 flex items-center space-x-1 border-r-black/50 border-r pr-2">
            {isFetching ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <span>{data?.idle}</span>
            )}
            <span>Idle</span>
          </div>
          <div className="text-green-600 flex items-center space-x-1 border-r-black/50 border-r pr-2">
            {isFetching ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <span>{data?.terpasang}</span>
            )}
            <span>Terpasang</span>
          </div>
          <div className="text-red-600 flex items-center space-x-1">
            {isFetching ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <span>{data?.belumSetor}</span>
            )}
            <span>Belum Setor</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalKotak;
