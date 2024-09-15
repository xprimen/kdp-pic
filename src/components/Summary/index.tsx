"use client";
import {
  CalendarIcon,
  ChevronDown,
  HandCoins,
  HeartHandshake,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import MonthListSelect from "../utilities/MonthListSelect";
import KotakScrollHorizontal from "./KotakScrollHorizontal";
import TotalKotak from "./TotalKotak";

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
        <TotalKotak />
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
      <KotakScrollHorizontal />
    </>
  );
};

export default Summary;
