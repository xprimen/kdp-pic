"use client";
import TopNavbar from "@/components/TopNavbar";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const Maps = () => {
  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar sticky="relative" title="Peta Kotak" backButton />
      <div className="flex h-screen">
        <Map center={{ lat: -4.1260987, lng: 104.1792463 }} />
      </div>
    </AnimateSlideIn>
  );
};

export default Maps;
