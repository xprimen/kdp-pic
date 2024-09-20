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
  // console.log(markers);
  const markerRef = React.useRef<Marker | null>(null);
  // const newCenter = center?.split(",") || [0,0];
  const latitude = center[0];
  const longitude = center[1];
  // const map = useMapEvents("click", () => {
  //   map.setView([center?.lat,center?.lng]);
  // });

  const customIcon = new Icon({
    // iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconUrl: "/assets/kotak.png",
    iconSize: [40, 40],
    iconAnchor: [12, 40],
  });
  // const customIcon = new Icon({
  //   iconUrl: "/assets/kotak.png",
  // });

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker && setValue) {
          // console.log(marker.getLatLng());
          const latLng = marker.getLatLng();
          // console.log("MARKER :", latLng);
          setValue(latLng.lat + "," + latLng.lng);
        }
      },
    }),
    [setValue]
  );

  return (
    <div className="flex h-full w-full bg-red-400">
      {/* <div>{JSON.stringify(markers)}</div> */}
      <MapContainer
        center={[latitude, longitude]}
        zoom={markers ? 13 : 16}
        // zoom={21}
        scrollWheelZoom={false}
        className="w-full"
        // whenReady={() => {}}
        // style={{ minHeight: 500 }}
      >
        <TileLayer
          attribution="&copy;google"
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          maxZoom={21}
        />
        {/* <TileLayer
        attribution="&copy;googles"
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      /> */}
        {/* <ReactLeafletGoogleLayer apiKey="AIzaSyDioFkflTTj67Zuj3N5hCnyL6ztpRCKcxI" /> */}
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
            // icon={markerIcon}
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
