"use client";
import QRCODEPrint from "@/components/QRCodePrint";

const size = 378;
const Page = ({
  params: { kode_kotak },
}: {
  params: { kode_kotak: string };
}) => {
  return <QRCODEPrint qr_text={kode_kotak} size={size} />;
};

export default Page;
