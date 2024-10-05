"use client";
import { QRCodeCanvas } from "qrcode.react";
import React from "react";
import { Button } from "../ui/button";
import median from "median-js-bridge";

const sizeDefault = 378;

type Props = {
  qr_text: string;
  size?: number;
  logo?: string;
};

const QRCODEPrint = ({
  qr_text,
  size = sizeDefault,
  logo = "/assets/logo.png",
}: Props) => {
  const height = size / 4;
  const width = size / 4;
  const kode_kotak = qr_text;
  const jarakX = (size - width) / 2;
  const jarakY = (size - height) / 2;

  const qrcodeCanvas = React.useRef<HTMLCanvasElement>(null);

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
      link.download = `QRCode Kotak ${kode_kotak}.png`;
      link.href = canvas.toDataURL();
      console.log("LINK URL QRCODE : ", link.href);
      link.click();
    }
  };

  const handleDownloadMedian = () => {
    if (qrcodeCanvas.current) {
      const canvas = qrcodeCanvas.current;
      const url = canvas.toDataURL("image/png");
      median.share.downloadImage({ url });
    }
  };

  return (
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
          src: logo,
          x: jarakX,
          y: jarakY,
          height,
          width,
          excavate: true,
          opacity: 1,
        }}
      />
      <Button
        variant="default"
        size="lg"
        onClick={() => {
          if (navigator.userAgent.indexOf("median") > -1) {
            return handleDownloadMedian();
          }
          return handleDownload();
        }}
      >
        Download
      </Button>
      {/* <Link
          target="_blank"
          href={`/cetak_qrcode/${kode_kotak}`}
          className="text-center text-lg font-bold bg-green-600 p-4 rounded-md text-white hover:bg-green-700"
        >
          Download
        </Link> */}
    </div>
  );
};

export default QRCODEPrint;
