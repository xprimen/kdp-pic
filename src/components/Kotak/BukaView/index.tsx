"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import TableToolbars from "@/components/utilities/TableToolbars";
import { getKotak } from "@/lib/actions/kotak";
import { queryClient } from "@/lib/utils";
import {
  LoginDataResponse,
  statusKotakBGColor,
  statusMessage,
  TKotak,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Box, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  userdata: LoginDataResponse;
};
const BukaView = ({ userdata }: Props) => {
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

  return (
    <div className="mb-20">
      <TableToolbars />
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
        {data?.map((dt: TKotak) => (
          <Link
            href={`/secure/kotak/pasang/${dt.id}`}
            key={dt.id}
            className="bg-white px-4 py-2"
          >
            <Card
              className={`w-full ${statusKotakBGColor[dt.id_status_kotak]}`}
            >
              <CardHeader className="py-6">
                <CardTitle className="text-lg flex items-center space-x-4 justify-between">
                  <div className="flex items-center space-x-4">
                    <Box size="20" />
                    <span>{dt.id_kotak}</span>
                  </div>
                  <span
                    className={`text-sm capitalize bg-slate-100 text-slate-600 rounded-lg px-3`}
                  >
                    {statusMessage[dt.id_status_kotak]}
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BukaView;
