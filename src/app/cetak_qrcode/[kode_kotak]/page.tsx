"use client";
import QRCODEPrint from "@/components/QRCodePrint";
import { QRCodeCanvas } from "qrcode.react";
import React from "react";

const size = 378;
const height = size / 4;
const width = size / 4;
const jarakX = (size - width) / 2;
const jarakY = (size - height) / 2;
const logo = "/assets/logo.png";

const Page = ({
  params: { kode_kotak },
}: {
  params: { kode_kotak: string };
}) => {
  const qrcodeCanvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (qrcodeCanvas.current) {
      const canvas = qrcodeCanvas.current;
      const link = document.createElement("a");
      link.download = `QRCode Kotak ${kode_kotak}.png`;
      link.href = canvas.toDataURL();
      console.log("LINK URL QRCODE : ", link.href);
      link.click();
    }
  }, [kode_kotak]);

  // return <QRCODEPrint qr_text={kode_kotak} size={size} />;
  return (
    <QRCodeCanvas
      ref={qrcodeCanvas}
      value={kode_kotak}
      size={size}
      title={kode_kotak}
      imageSettings={{
        src: logo,
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
