"use client";
import { HandCoins, Box } from "lucide-react";
import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "../ui/card";

const Summary = () => {
  return (
    <div className="flex flex-col space-y-4 px-4 mb-4">
      <Card x-chunk="dashboard-05-chunk-2" className="relative">
        <HandCoins className="absolute text-slate-300 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
        <CardHeader className="pb-2">
          <CardDescription>Total Donasi</CardDescription>
          <CardTitle className="text-4xl">Rp 125jt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            <span className="text-green-600">Rp 4.350.000</span> Donasi Terbaru
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
  );
};

export default Summary;
