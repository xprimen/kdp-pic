"use client";
import { HandCoins, Box, Pin, PinIcon, MapPin, User } from "lucide-react";
import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const Summary = () => {
  const kotak_segel = [0, 2, 7];
  const kotak_belum_setor = [4, 5];
  const kotak_standby = [1, 3, 6, 8, 9];
  return (
    <>
      <div className="flex flex-col space-y-4 px-4 mb-4">
        <Card
          x-chunk="dashboard-05-chunk-2"
          className="bg-primary text-white relative"
        >
          <HandCoins className="absolute text-white/30 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          <CardHeader className="pb-2">
            <CardDescription className="text-white">
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
        <Card x-chunk="dashboard-05-chunk-2" className="relative shadow-lg">
          <Box className="absolute text-slate-300 right-0 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          <CardHeader className="pb-2">
            <CardDescription>Total Kotak</CardDescription>
            <CardTitle className="text-4xl">15 Kotak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-blue-600">5 standby</span>,{" "}
              <span className="text-green-600">3 tersegel</span>,{" "}
              <span className="text-red-600">2 belum setor</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col">
        <h2 className="font-semibold px-4">Kotak</h2>
        <ScrollArea className="whitespace-nowrap">
          <div className="flex space-x-4 p-4">
            {[...Array(10)].map((_, i) => (
              <Card
                key={i}
                className={`w-72 ${
                  kotak_segel.includes(i)
                    ? "bg-green-600 text-white"
                    : kotak_belum_setor.includes(i)
                    ? "bg-red-600 text-white"
                    : ""
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex text-lg justify-between">
                    <span>Kotak {i + 1}</span>
                    {!kotak_standby.includes(i) && (
                      <MapPin className="w-6 h-6" />
                    )}
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col pt-4">
                  <div className="flex gap-x-2">
                    <User /> PIC
                  </div>
                  {!kotak_standby.includes(i) && <div>Rp 1.000.000</div>}
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
