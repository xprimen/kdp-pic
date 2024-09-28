import { getKotakSudahDisetor } from "@/lib/actions/kotak";
import { numberToString, queryClient } from "@/lib/utils";
import { TKotakSetor } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";

const chartConfig = {
  donasi: {
    label: "Donasi",
    color: "#16a34a",
  },
  disetor: {
    label: "Disetor",
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
  const { data, isFetching } = useQuery({
    queryKey: ["historyKotakSetor"],
    queryFn: async (): Promise<any> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const data = (await getKotakSudahDisetor(accessToken)) as TKotakSetor[];
      const groups = data.reduce((group, d: TKotakSetor) => {
        const tglSetor = d.setor?.tgl_setor;
        const month = tglSetor ? tglSetor.split("-")[1] : "";

        if (!group[month]) {
          group[month] = 0;
        }
        // group[month].push(d);
        group[month] = d.pendapatan_kotak + group[month];
        return group;
      }, {} as Record<string, number>);

      const groupArrays = Object.keys(groups).map((month) => {
        return {
          month: Number(month) - 1,
          disetor: groups[month],
        };
      });

      const res = months.map((month, key: number) => {
        const disetor = groupArrays.find((d) => d.month === key)?.disetor || 0;
        return {
          month,
          disetor,
        };
      });

      return res;
    },
  });

  return (
    <Card className="mx-4 pt-4">
      <CardHeader>
        <CardTitle>Donasi Disetor Tahun {new Date().getFullYear()}</CardTitle>
      </CardHeader>
      <CardContent>
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
              <Bar dataKey="disetor" fill="var(--color-disetor)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
