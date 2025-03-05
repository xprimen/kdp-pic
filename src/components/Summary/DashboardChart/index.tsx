import { Button } from "@/components/ui/button";
import {
  getGrafiksetoranGlobal,
  getGrafiksetoranPW,
} from "@/lib/actions/kotak";
import { numberToString, queryClient } from "@/lib/utils";
import { TChartKotak } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent } from "../../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";

const chartConfig = {
  donasiGlobal: {
    label: "Setoran Global",
    color: "#16a34a",
  },
  donasiPW: {
    label: "Setoran Anda",
    color: "#f9802d",
  },
} satisfies ChartConfig;

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

const DashboardChart = () => {
  const [year, setYear] = React.useState(
    new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(new Date())
  ); //Tahun Grafik

  const { data, isFetching } = useQuery({
    queryKey: ["historyKotakSetor", year],
    queryFn: async (): Promise<any> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };

      const data_pw = (await getGrafiksetoranPW(
        accessToken,
        Number(year)
      )) as TChartKotak[];

      const data_global = (await getGrafiksetoranGlobal(
        accessToken,
        Number(year)
      )) as TChartKotak[];

      const data_global_edit = data_global.filter((d) =>
        d.month_year.includes(String(year))
      );

      const res = months.map((month, key: number) => {
        const dataPW = data_pw.find((d, index) => {
          if (Number(year) === 2024) {
            return index === key - 10;
          } else {
            return index === key;
          }
        });
        const dataGLobal = data_global_edit.find((d, index) => {
          if (Number(year) === 2024) {
            return index === key - 10;
          } else {
            return index === key;
          }
        });
        return {
          month,
          donasiPW: dataPW?.total_pendapatan || 0,
          donasiGlobal: dataGLobal?.total_pendapatan || 0,
        };
      });

      return res;
    },
  });

  const arrowButton = (arrow: "left" | "right") => (
    <Button
      disabled={
        Number(year) <= 2024
          ? arrow === "left"
            ? true
            : false
          : arrow === "left"
          ? false
          : true
      }
      onClick={() => {
        const newYear = Number(year) + (arrow === "left" ? -1 : 1);
        setYear(String(newYear));
      }}
      variant="outline"
      size="icon"
      className="w-8 h-8 border-0 bg-transparent rounded-full"
    >
      {arrow === "left" ? (
        <ChevronLeft size={20} className="text-foreground" />
      ) : (
        <ChevronRight size={20} className="text-foreground" />
      )}
    </Button>
  );

  return (
    <Card className="mx-4 pt-4">
      <CardContent>
        <div className="flex flex-row justify-between items-center pb-4">
          <h4>Grafik Setoran Tahun {year}</h4>
          {isFetching ? (
            <Loader className="text-slate-500 animate-spin" />
          ) : (
            <div className="flex flex-row items-center gap-x-2">
              {arrowButton("left")}
              {arrowButton("right")}
            </div>
          )}
        </div>
        {isFetching ? (
          <div className="min-h-[200px] w-full flex justify-center items-center">
            <Loader className="text-slate-500 animate-spin" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => {
                      const newFormat = numberToString(Number(value));
                      return `Rp ${newFormat}`;
                    }}
                    indicator="dot"
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {/* <Bar dataKey="donasi" fill="var(--color-donasi)" radius={4} /> */}
              <Bar
                dataKey="donasiPW"
                fill={chartConfig.donasiPW.color}
                radius={4}
              />
              <Bar
                dataKey="donasiGlobal"
                fill={chartConfig.donasiGlobal.color}
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
