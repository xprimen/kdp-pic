"use client";
import TopNavbar from "@/components/TopNavbar";
import React, { useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import median from "median-js-bridge";
import QRCODEPrint from "@/components/QRCodePrint";

const Page = ({
  params: { kode_kotak },
}: {
  params: { kode_kotak: string };
}) => {
  const router = useRouter();
  const size = 378;
  const height = size / 4;
  const width = size / 4;
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

  /* const handleDownload = () => {
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
      // console.log("LINK URL QRCODE : ", link.href);
      // router.push(base64Image);
      // postMessage(
      //   {
      //     type: "download-qrcode-kotak",
      //     data: {
      //       kode_kotak,
      //       base64Image,
      //       blob,
      //     },
      //   },
      //   "*"
      // );
    }
  }; */
  const handleDownloadQRCode = () => {
    if (qrcodeCanvas.current) {
      const canvas = qrcodeCanvas.current;
      const url = canvas.toDataURL("image/png");
      median.share.downloadImage({ url });
    }
  };

  const getPlatform = async () => {
    return await median.getPlatform().then((platform) => platform);
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNavbar title="QRCode Kotak" backButton />
      <QRCODEPrint qr_text={kode_kotak} />
    </div>
  );
};

export default Page;
