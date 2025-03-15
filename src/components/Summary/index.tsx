"use client";
import {
  getHanyaSetoranPW,
  getTotalDonasi,
  getTotalSetor,
} from "@/lib/actions/kotak";
import { numberToString, queryClient } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { HandCoins, HeartHandshake, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import DashboardChart from "./DashboardChart";
import KotakScrollHorizontal from "./KotakScrollHorizontal";
import TotalKotak from "./TotalKotak";
import { LoginDataResponse } from "@/types";

type Props = {
  userdata: LoginDataResponse;
};

const Summary = ({ userdata }: Props) => {
  const { data: total } = useQuery({
    queryKey: ["totalDonasi"],
    queryFn: async () => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const dataTotalDonasi = (await getTotalDonasi(accessToken)) as {
        total_pendapatan: string;
        month_year: string;
      };
      const dataTotalSetor = (await getTotalSetor(accessToken)) as {
        total_pendapatan: string;
        month_year: string;
      };

      const dataTotalSetorPW = (await getHanyaSetoranPW(accessToken)) as {
        total_pendapatan: string;
        month_year: string;
      };

      return {
        total_setor_pw: {
          month_year: dataTotalSetorPW?.month_year,
          nilai: numberToString(Number(dataTotalSetorPW.total_pendapatan)),
        },
        total_donasi: {
          month_year: dataTotalDonasi?.month_year,
          nilai: numberToString(Number(dataTotalDonasi.total_pendapatan)),
        },
        total_setor: {
          month_year: dataTotalSetor
            ? dataTotalSetor.month_year
            : Intl.DateTimeFormat("id-ID", {
                year: "numeric",
                month: "short",
              }).format(new Date()),
          nilai: dataTotalSetor
            ? numberToString(Number(dataTotalSetor.total_pendapatan))
            : 0,
        },
      };
    },
    refetchOnMount: true,
  });

  const router = useRouter();

  return (
    <>
      {/* <div className="flex items-center justify-end px-4 pb-4">
        <MonthListSelect setValue={setMonthSelected} months={months}>
          <Button variant="outline" className="gap-x-2 font-semibold">
            <CalendarIcon size={16} /> {months[monthSelected]}{" "}
            <ChevronDown size={16} />
          </Button>
        </MonthListSelect>
      </div> */}
      <Separator className="mb-4" />
      <div className="flex flex-col space-y-4 px-4 mb-4">
        <Card className="bg-green-600 text-white relative py-4">
          <HandCoins className="absolute text-white/30 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          <CardHeader className="py-2">
            <CardDescription className="text-white uppercase">
              Total Donasi Bulan :{" "}
              <span className="font-bold">
                {total?.total_donasi.month_year}
              </span>
            </CardDescription>
            <CardTitle className="text-4xl">
              Rp {total?.total_donasi.nilai}
            </CardTitle>
          </CardHeader>
        </Card>
        {userdata.role === "2" && (
          <Card className="bg-blue-400 text-white relative py-4">
            <HeartHandshake className="absolute text-white/30 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
            <CardHeader className="py-2">
              <CardDescription className="text-white uppercase">
                Total Disetor PW Bulan :{" "}
                <span className="font-bold">
                  {total?.total_setor_pw.month_year}
                </span>
              </CardDescription>
              <CardTitle className="text-4xl">
                Rp {total?.total_setor_pw.nilai || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        )}
        <Card className="bg-[#f9802d] text-white relative py-4">
          <HeartHandshake className="absolute text-white/30 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          <CardHeader className="py-2">
            <CardDescription className="text-white uppercase">
              Total Disetor Bulan :{" "}
              <span className="font-bold">{total?.total_setor.month_year}</span>
            </CardDescription>
            <CardTitle className="text-4xl">
              Rp {total?.total_setor.nilai || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <TotalKotak />
        <Card
          onClick={() => router.push("/secure/maps")}
          className="bg-yellow-500 text-white relative py-6 cursor-pointer"
        >
          <MapPin className="absolute text-white/30 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          <CardHeader>
            <CardTitle className="text-3xl">Peta Kotak</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <DashboardChart />
      <KotakScrollHorizontal />
    </>
  );
};

export default Summary;
