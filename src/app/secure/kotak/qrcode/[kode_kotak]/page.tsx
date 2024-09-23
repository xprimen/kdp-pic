"use client";
import TopNavbar from "@/components/TopNavbar";
import React, { useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

const Page = ({
  params: { kode_kotak },
}: {
  params: { kode_kotak: string };
}) => {
  const size = 378;
  const height = size / 3;
  const width = size / 3;
  const jarakX = (size - width) / 2;
  const jarakY = (size - height) / 2;

  const qrcodeCanvas = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    if (qrcodeCanvas.current) {
      const canvas = qrcodeCanvas.current;
      const link = document.createElement("a");
      link.download = `QRCode Kotak ${kode_kotak}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNavbar title="QRCode Kotak" backButton />
      <div className="flex flex-col items-center space-y-8 justify-center h-full">
        <QRCodeCanvas
          ref={qrcodeCanvas}
          value={kode_kotak}
          size={size}
          title={kode_kotak}
          imageSettings={{
            src: "/assets/logo.png",
            x: jarakX,
            y: jarakY,
            height,
            width,
            excavate: true,
            opacity: 1,
          }}
        />
        <Button variant="default" size="lg" onClick={() => handleDownload()}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default Page;
