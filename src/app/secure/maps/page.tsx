"use client";
import TopNavbar from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import { getKotak } from "@/lib/actions/kotak";
import useCurrentLocation from "@/lib/useCurrentLocation";
import { queryClient } from "@/lib/utils";
import { TGeocodeMarkers, TKotak } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Loader, RotateCw } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const setMarkers: TGeocodeMarkers = [
  {
    geocode: [-4.1260987, 104.1792463],
    popup: "Ini Contoh 1",
  },
  {
    geocode: [-4.1271987, 104.1292463],
    popup: "Ini Contoh 2",
  },
  {
    geocode: [-4.1282987, 104.1392463],
    popup: "Ini Contoh 3",
  },
  {
    geocode: [-4.1293987, 104.1492463],
    popup: "Ini Contoh 4",
  },
];
const Maps = () => {
  const router = useRouter();
  const { location, error } = useCurrentLocation();
  const { data, isFetching } = useQuery({
    queryKey: ["kotak-terpasang"],
    // enabled:!!accessToken,
    queryFn: async (): Promise<TGeocodeMarkers> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const data = await getKotak(accessToken);
      const filterData = data.filter((dt: TKotak) => dt.id_status_kotak === 2);
      // console.log("GEOCODE : ", filterData);
      return filterData.map((d) => {
        const geocode = d.latLng?.split(",");
        const lat = geocode ? Number(geocode[0]) : 0;
        const lng = geocode ? Number(geocode[1]) : 0;
        return {
          geocode: [lat, lng],
          popup: `Kotak ID : ${d.id_kotak}`,
        };
      });
      // const kotaks = (await queryClient.getQueryData(["kotak"])) as TKotak[];
      // const filterData = kotaks.filter(
      //   (dt: TKotak) => dt.id_status_kotak === 2
      // );
      // return filterData.map((d) => {
      //   const geocode = d.latLng?.split(",");
      //   const lat = geocode ? Number(geocode[0]) : 0;
      //   const lng = geocode ? Number(geocode[1]) : 0;
      //   return {
      //     geocode: [lat, lng],
      //     popup: `Kotak ID : ${d.id_kotak}`,
      //   };
      // });
    },
    // refetchOnWindowFocus: true,
  });

  // console.log("KOTAKS :", setMarkers);

  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar
        sticky="relative"
        title="Peta Kotak"
        backButton
        rightButtons={
          <Button
            onClick={() => window.location.reload()}
            type="button"
            variant="outline"
            className="shadow-lg rounded-full p-2"
          >
            <RotateCw />
          </Button>
        }
      />
      <div className="flex h-screen">
        {isFetching ? (
          <div className="m-auto">
            <Loader className="mr-2 h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Map
            center={[location.latitude, location.longitude]}
            markers={data}
          />
        )}
      </div>
    </AnimateSlideIn>
  );
};

export default Maps;
