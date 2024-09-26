"use client";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import React, { useCallback, useEffect } from "react";

const size = 378;
const height = size / 3;
const width = size / 3;
const jarakX = (size - width) / 2;
const jarakY = (size - height) / 2;

const Page = ({
  params: { kode_kotak },
}: {
  params: { kode_kotak: string };
}) => {
  const qrcodeCanvas = React.useRef<HTMLCanvasElement>(null);

  const handleDownload = useCallback(() => {
    if (qrcodeCanvas.current) {
      const canvas = qrcodeCanvas.current;
      const link = document.createElement("a");
      link.download = `QRCode Kotak ${kode_kotak}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  }, [kode_kotak]);

  useEffect(() => {
    handleDownload();
  }, [handleDownload]);

  return (
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
  );
};

export default Page;
