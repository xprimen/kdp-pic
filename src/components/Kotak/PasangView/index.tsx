"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import TableToolbars from "@/components/utilities/TableToolbars";
import { getKotak } from "@/lib/actions/kotak";
import { TKotak, LoginDataResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Box, QrCode, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  userdata: LoginDataResponse;
  token: string;
};
const PasangView = ({ token }: Props) => {
  const { data, isFetching } = useQuery({
    queryKey: ["kotak"],
    queryFn: async () => getKotak(token, "idle"),
    // refetchOnWindowFocus: true,
  });

  console.log(data);

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
        {data?.map((dt: TKotak) => (
          <Link
            href={`/secure/kotak/pasang/${dt.id}`}
            key={dt.id}
            className="bg-white px-4 py-2"
          >
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-lg flex items-center gap-x-2">
                  <Box size="20" /> {dt.id}{" "}
                  <span className="text-xs text-white capitalize bg-slate-400 rounded-lg px-2">
                    {dt.status_kotak}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-500 text-sm flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" type="button">
                        <QrCode size={16} className="mr-1" /> Cetak
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <div className="text-slate-700 font-semibold">
                        <Image
                          src={
                            "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
                            dt.id
                          }
                          width={200}
                          height={200}
                          alt="qr-code"
                        />
                        {dt.status_kotak}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <span className="text-slate-700 font-semibold">
                    {dt.status_kotak}
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

export default PasangView;
