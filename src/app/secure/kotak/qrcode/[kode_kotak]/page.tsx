"use client";
import QRCODEPrint from "@/components/QRCodePrint";
import TopNavbar from "@/components/TopNavbar";

const Page = ({
  params: { kode_kotak },
}: {
  params: { kode_kotak: string };
}) => {
  return (
    <div className="flex flex-col h-screen">
      <TopNavbar title="QRCode Kotak" backButton />
      <QRCODEPrint qr_text={kode_kotak} />
    </div>
  );
};

export default Page;
