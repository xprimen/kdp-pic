"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { Box, QrCode, ScanQrCodeIcon, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  userdata: LoginDataResponse;
};

const PasangView = ({ userdata }: Props) => {
  const router = useRouter();
  const { data, isFetching } = useQuery({
    queryKey: ["kotakIdle"],
    queryFn: async (): Promise<TKotak[]> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const data = await getKotak(accessToken);
      const filterIdle = data.filter(
        (dt: TKotak) => dt.id_status_kotak === 1 || dt.id_status_kotak === 3
      );
      return filterIdle;
    },
  });

  return (
    <div className="mb-20">
      <TableToolbars
        add={{
          link: "/secure/kotak/pasang/scan",
          label: "Scan Kotak",
          variant: "default",
          icon: <ScanQrCodeIcon className="w-4 h-4" />,
        }}
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
        {data?.map((dt: TKotak) => (
          <div key={dt.id} className="bg-white px-4">
            <Card
              className={`w-full text-slate-800 ${
                statusKotakBGColor[dt.id_status_kotak]
              }`}
            >
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center space-x-4 justify-between">
                  <div className="flex items-center space-x-2">
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
              <Separator />
              <CardContent className="text-sm flex justify-between py-4">
                <div className="flex items-center space-x-2">
                  <UserCircle size="20" />
                  <span>{dt.PkUser?.nama || dt.PwUser?.nama}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/cetak_qrcode/" + dt.id_kotak);
                  }}
                >
                  <QrCode size="25" />
                </Button>
              </CardContent>
              {userdata.role === "2" && dt.id_pk === null && (
                <CardFooter className="p-0">
                  <Link
                    href={`/secure/kotak/pasang/${dt.id}`}
                    className="bg-slate-200 w-full hover:text-white focus:text-white active:text-white px-4 py-4 justify-center rounded-b-md flex items-center space-x-1 hover:bg-green-600 active:bg-green-600 focus:bg-green-600"
                  >
                    <Box size="14" />
                    <span>Pasang</span>
                  </Link>
                </CardFooter>
              )}
              {userdata.role === "3" && dt.id_pk === userdata.id && (
                <CardFooter className="p-0">
                  <Link
                    href={`/secure/kotak/pasang/${dt.id}`}
                    className="bg-slate-200 w-full hover:text-white focus:text-white active:text-white px-4 py-4 justify-center rounded-b-md flex items-center space-x-1 hover:bg-green-600 active:bg-green-600 focus:bg-green-600"
                  >
                    <Box size="14" />
                    <span>Pasang</span>
                  </Link>
                </CardFooter>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasangView;
