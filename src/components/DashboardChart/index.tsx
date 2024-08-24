import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const chartData = [
  { month: "January", donasi: 186, disetor: 186 },
  { month: "February", donasi: 305, disetor: 200 },
  { month: "March", donasi: 237, disetor: 237 },
  { month: "April", donasi: 73, disetor: 73 },
  { month: "May", donasi: 209, disetor: 130 },
  { month: "June", donasi: 214, disetor: 140 },
];

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

const DashboardChart = () => {
  return (
    <Card className="mx-4 pt-4">
      <CardHeader>
        <CardTitle>Donasi Terkumpul</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="donasi" fill="var(--color-donasi)" radius={4} />
            <Bar dataKey="disetor" fill="var(--color-disetor)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
