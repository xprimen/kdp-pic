"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TableToolbars from "@/components/utilities/TableToolbars";
import { getEkspedisiKotak } from "@/lib/actions/kotak";
import { queryClient } from "@/lib/utils";
import { LoginDataResponse, TEkspedisiKotak } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Calendar, CheckCircle, FileBox, Info } from "lucide-react";
import Link from "next/link";

type Props = {
  userdata: LoginDataResponse;
};
const EkspedisiView = ({ userdata }: Props) => {
  const { data, isFetching } = useQuery({
    queryKey: ["ekspedisi"],
    queryFn: async (): Promise<TEkspedisiKotak[]> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      // console.log("USERID :", userdata.id);
      return await getEkspedisiKotak(accessToken, userdata.id);
    },
    // refetchOnWindowFocus: true,
  });

  return (
    <div className="mb-20">
      <TableToolbars add={{ link: "/secure/kotak/pasang" }} />
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
        {data?.map((dt: TEkspedisiKotak) => (
          <Link
            href={`/secure/kotak/ekspedisi/${dt.id}`}
            key={dt.id}
            className="bg-white px-4 py-2"
          >
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-lg flex justify-between items-center gap-x-2">
                  <div className="flex items-center gap-x-2">
                    <FileBox size="20" />
                    <h2>Kiriman Kotak dari {dt.pengirim.nama}</h2>
                  </div>
                  {dt.status_terima === 1 ? (
                    <CheckCircle size="20" className="text-green-500" />
                  ) : (
                    <Info size="20" className="text-yellow-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-500 text-sm flex justify-between">
                  <div className="flex gap-2 items-center">
                    <Calendar size="20" />
                    <span className="text-slate-700 font-semibold">
                      {Intl.DateTimeFormat("id-ID").format(
                        new Date(dt.tgl_kirim)
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EkspedisiView;
