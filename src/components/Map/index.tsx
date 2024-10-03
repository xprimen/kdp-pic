"use client";
import { TGeocodeMarkers } from "@/types";
import L, {
  type Layer,
  type Map as MapLeafletType,
  type Marker,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";

type Props = {
  center: number[];
  markers?: TGeocodeMarkers | null;
  setValue?: (val: string) => void;
};

const Map = ({ center, markers, setValue }: Props) => {
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<MapLeafletType | null>(null);
  const markerRef = React.useRef<Marker | null>(null);
  const [mapReady, setMapReady] = React.useState(false);
  const [zoom, setZoom] = React.useState(markers ? 13 : 15);
  const latitude = center[0];
  const longitude = center[1];

  const customIcon = L.icon({
    // iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconUrl: "/assets/kotak.png",
    iconSize: [40, 40],
    iconAnchor: [12, 40],
  });

  const CreateMarker = React.useCallback(
    (lat: number, long: number) => {
      let markerLayer: Layer;
      if (markers) {
        markers?.map((marker, i) => {
          markerLayer = L.marker([marker.geocode[0], marker.geocode[1]], {
            icon: customIcon,
          })
            .bindPopup(
              `<h2 class="font-bold py-1 my-0">ID Kotak : ${
                marker.data.id_kotak
              }</h2>
        <p class="py-1 !my-0">PIC : ${
          marker.data.PkUser?.nama || marker.data.PwUser?.nama
        }</p>
        <p class="py-1 !my-0">Tanggal Pasang : ${new Intl.DateTimeFormat(
          "id-ID",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          }
        ).format(new Date(marker?.data?.tgl_start!))}</p>
        `,
              {
                closeButton: false,
                autoClose: true,
              }
            )
            .addTo(map.current!);
        });
      } else {
        markerLayer = L.marker([lat, long], {
          icon: customIcon,
          draggable: true,
        })
          .bindPopup(
            `<h2 class="font-bold py-1 my-0">Posisi Anda</h2>
        <p class="py-1 !my-0">Tekan dan Geser Pin untuk mengubah posisi</p>
        `,
            {
              closeButton: false,
              autoClose: true,
            }
          )
          // .addEventListener("dragend", eventHandlers.dragend)
          .addTo(map.current!);
        markerLayer.on("dragend", (e: L.DragEndEvent) => {
          const latlng = e.target.getLatLng();
          if (setValue) {
            setValue(latlng.lat + "," + latlng.lng);
            if (map.current?.getZoom()) setZoom(map.current.getZoom());
          }
        });
      }

      map.current?.on("load", () => {
        markerLayer.remove();
      });
    },
    [customIcon, markers, setValue]
  );

  React.useEffect(() => {
    map.current = L.map(mapContainerRef.current!).setView(
      [latitude, longitude],
      zoom
    );
    L.tileLayer(
      "https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}",
      {
        attribution: "Map data &copy; Google",
        maxZoom: 21,
      }
    ).addTo(map.current);

    CreateMarker(latitude, longitude);

    return () => {
      map?.current?.remove();
    };
  }, [CreateMarker, latitude, longitude, zoom]);

  return (
    <div className="flex h-full w-full">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default Map;
