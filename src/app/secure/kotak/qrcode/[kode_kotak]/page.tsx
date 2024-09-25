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

  /* const b64toBlob = (
    base64Image: string,
    contentType = "image/png",
    sliceSize = 512
  ) => {
    // Split into two parts
    const parts = base64Image.split(";base64,");

    // Hold the content type
    const imageType = parts[0].split(":")[1];

    // Decode Base64 string
    const decodedData = globalThis.atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: contentType });
  }; */

  const handleDownload = () => {
    if (qrcodeCanvas.current) {
      const canvas = qrcodeCanvas.current;
      const link = document.createElement("a");
      // const base64Image = canvas.toDataURL();
      // const blob = b64toBlob(base64Image);
      link.download = `QRCode Kotak ${kode_kotak}.png`;
      // link.href = URL.createObjectURL(blob);
      link.href = canvas.toDataURL();
      console.log("LINK URL QRCODE : ", link.href);
      link.click();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNavbar title="QRCode Kotak" backButton />
      <div className="flex flex-col items-center space-y-8 justify-center h-full">
        <h2 className="text-xl text-center">
          Kode Kotak : <span className="font-bold">{kode_kotak}</span>
        </h2>
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
