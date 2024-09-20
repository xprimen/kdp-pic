"use client";
import { TGeocodeMarkers } from "@/types";
import { Icon, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import {
  MapContainer,
  Marker as MarkerComp,
  Popup,
  TileLayer,
} from "react-leaflet";

type Props = {
  center: number[];
  markers?: TGeocodeMarkers | null;
  setValue?: (val: string) => void;
};

const Map = ({ center, markers, setValue }: Props) => {
  const markerRef = React.useRef<Marker | null>(null);
  const latitude = center[0];
  const longitude = center[1];

  const customIcon = new Icon({
    // iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconUrl: "/assets/kotak.png",
    iconSize: [40, 40],
    iconAnchor: [12, 40],
  });

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker && setValue) {
          const latLng = marker.getLatLng();
          setValue(latLng.lat + "," + latLng.lng);
        }
      },
    }),
    [setValue]
  );

  return (
    <div className="flex h-full w-full bg-red-400">
      <MapContainer
        center={[latitude, longitude]}
        zoom={markers ? 13 : 16}
        scrollWheelZoom={false}
        className="w-full"
      >
        <TileLayer
          attribution="&copy;google"
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          maxZoom={21}
        />
        {markers ? (
          markers?.map((marker, i) => (
            <MarkerComp
              key={i}
              position={[marker.geocode[0], marker.geocode[1]]}
              icon={customIcon}
            >
              <Popup>{marker.popup}</Popup>
            </MarkerComp>
          ))
        ) : (
          <MarkerComp
            draggable={true}
            eventHandlers={eventHandlers}
            position={[latitude, longitude]}
            ref={markerRef}
            icon={customIcon}
          >
            <Popup autoClose>
              <div className="text-center">
                Anda Disini.
                <br />
                Tekan dan Geser Pin untuk mengubah posisi
              </div>
            </Popup>
          </MarkerComp>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
