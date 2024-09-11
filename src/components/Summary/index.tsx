"use client";
import {
  Box,
  CalendarIcon,
  ChevronDown,
  ChevronRight,
  HandCoins,
  HeartHandshake,
  MapPin,
  User,
} from "lucide-react";
import React from "react";
import DashboardChart from "../DashboardChart";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import MonthListSelect from "../utilities/MonthListSelect";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { TKotak } from "@/types";
import { queryClient } from "@/lib/utils";
import { getKotak } from "@/lib/actions/kotak";

const Summary = () => {
  const router = useRouter();
  const [monthSelected, setMonthSelected] = React.useState(
    new Date().getMonth()
  );
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  // const offsetReverseMonths = months
  //   .concat(...months.splice(0, new Date().getMonth()))
  //   .reverse();

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

  const kotak_segel = [0, 2, 7];
  const kotak_belum_setor = [4, 5];
  const kotak_standby = [1, 3, 6, 8, 9];
  return (
    <>
      <div className="flex items-center justify-end px-4 pb-4">
        <MonthListSelect setValue={setMonthSelected} months={months}>
          <Button variant="outline" className="gap-x-2 font-semibold">
            <CalendarIcon size={16} /> {months[monthSelected]}{" "}
            <ChevronDown size={16} />
          </Button>
        </MonthListSelect>
      </div>
      <div className="flex flex-col space-y-4 px-4 mb-4">
        <Card
          // x-chunk="dashboard-05-chunk-2"
          className="bg-blue-500 text-white relative"
        >
          <HandCoins className="absolute text-white/30 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          <CardHeader className="pb-2">
            <CardDescription className="text-white uppercase">
              Total Donasi
            </CardDescription>
            <CardTitle className="text-4xl">Rp 125jt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-white/70">
              <span className="text-white font-semibold">Rp 4.350.000</span>{" "}
              Donasi Terbaru
            </div>
          </CardContent>
        </Card>
        <Card
          // x-chunk="dashboard-05-chunk-2"
          className="bg-primary text-white relative"
        >
          <HeartHandshake className="absolute text-white/30 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          <CardHeader className="pb-2">
            <CardDescription className="text-white uppercase">
              Total Disetor
            </CardDescription>
            <CardTitle className="text-4xl">Rp 120jt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-white/70">
              <span className="text-white font-semibold">Rp 2.650.000</span>{" "}
              Setoran Terbaru
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-05-chunk-2" className="relative">
          <Box className="absolute text-slate-300 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          <CardHeader className="pb-2">
            <CardDescription>Total Kotak</CardDescription>
            <CardTitle className="text-4xl">10 Kotak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-blue-600">5 standby</span>,{" "}
              <span className="text-green-600">3 tersegel</span>,{" "}
              <span className="text-red-600">2 belum setor</span>
            </div>
          </CardContent>
        </Card>
        <Card
          onClick={() => router.push("/secure/maps")}
          className="bg-yellow-500 text-white relative py-6 cursor-pointer"
        >
          <MapPin className="absolute text-white/30 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          <CardHeader>
            {/* <CardDescription className="text-white uppercase">
              Peta
            </CardDescription> */}
            <CardTitle className="text-3xl">Peta Kotak</CardTitle>
          </CardHeader>
          {/* <CardContent>
            <div className="text-xs text-white/70">
              <span className="text-white font-semibold">Rp 2.650.000</span>{" "}
              Setoran Terbaru
            </div>
          </CardContent> */}
        </Card>
      </div>
      <DashboardChart />
      <div className="flex flex-col py-4">
        <div className="flex justify-between px-4">
          <h2 className="font-semibold px-4">Kotak</h2>
          <Link href="/secure/kotak?tab=pasang" className="flex items-center">
            <span>Detail</span> <ChevronRight className="text-slate-500" />
          </Link>
        </div>
        <ScrollArea className="whitespace-nowrap">
          <div className="flex space-x-4 p-4">
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
                    <CardTitle className="flex text-lg justify-between">
                      <span>Kotak {i + 1}</span>
                      {kotak.id_status_kotak === 2 && (
                        <MapPin className="w-6 h-6" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="flex flex-col pt-4">
                    <div className="flex gap-x-2">
                      <User /> PIC
                    </div>
                    {kotak.id_status_kotak === 3 && <div>Rp 1.000.000</div>}
                  </CardContent>
                </Card>
              ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export default Summary;
