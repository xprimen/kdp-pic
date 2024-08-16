"use client";
import BottomNavbar from "@/components/BottomNavbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginDataResponse } from "@/types";
import { Box, HandCoins } from "lucide-react";
import React from "react";
import _ from "lodash";

function Dashboard() {
  const [dataKotak, setDataKotak] = React.useState<any[] | undefined>();

  const userdata = (): LoginDataResponse | null => {
    const data = window.localStorage.getItem("userdata")!;
    return data ? JSON.parse(data) : null;
  };
  const getKotak = React.useCallback(async () => {
    const pic_wilayah = await fetch(
      "https://json-server-tester.vercel.app/pic_wilayah",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          return { success: false, message: "Data Gagal" };
        }
        return res.json();
      })
      .then((data) => data);

    // const pic_kotak = _.map(pic_wilayah, "id_kotak");

    const getKotak = await fetch(
      "https://json-server-tester.vercel.app/kotak",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          return { success: false, message: "Data Gagal" };
        }
        return res.json();
      })
      .then((data) => data);

    const kotak_wilayah = _.map(pic_wilayah, (o) => ({
      status_kotak: o.status_kotak,
      tgl_dikirim: o.tgl_dikirim,
      tgl_diterima: o.tgl_diterima,
      kotak: _.find(getKotak, (k) => k.id == o.id_kotak),
    }));
    // console.log("kotak_wilayah :", kotak_wilayah);

    setDataKotak(kotak_wilayah);
  }, []);

  React.useEffect(() => {
    getKotak();
  }, [getKotak]);

  // console.log("kotak :", dataKotak);

  return (
    <>
      <BottomNavbar />
      <div className="flex items-center justify-center h-full px-4 py-4">
        <div className="flex-1 font-semibold">Hi, {userdata()?.name}</div>
      </div>
      <div className="flex flex-col space-y-4 px-4">
        <Card x-chunk="dashboard-05-chunk-2" className="relative">
          <HandCoins className="absolute text-slate-300 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          <CardHeader className="pb-2">
            <CardDescription>Total Donasi</CardDescription>
            <CardTitle className="text-4xl">Rp 125jt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-600">Rp 4.350.000</span> Donasi
              Terbaru
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-05-chunk-2" className="relative">
          <Box className="absolute text-slate-300 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          <CardHeader className="pb-2">
            <CardDescription>Total Kotak</CardDescription>
            <CardTitle className="text-4xl">15 Kotak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-blue-600">3 standby</span>,{" "}
              <span className="text-green-600">12 tersegel</span>,{" "}
              <span className="text-red-600">2 belum setor</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col space-y-2">
        <h2 className="font-semibold px-4">Kotak</h2>
        <div className="flex flex-col space-y-4 px-4">asd</div>
      </div>
    </>
  );
}

export default Dashboard;
