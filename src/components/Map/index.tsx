"use client";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMapEvents } from "react-leaflet/hooks";

type Props = {
  center?: { lat: number; lng: number };
};

const Map = ({ center }: Props) => {
  const newCenter = [center?.lat, center?.lng];
  // const map = useMapEvents("click", () => {
  //   map.setView([center?.lat,center?.lng]);
  // });

  const markers = [
    {
      geocode: [-4.1260987, 104.1792463, 10],
      popup: "Ini Contoh 1",
    },
    {
      geocode: [-4.1271987, 104.1292463, 10],
      popup: "Ini Contoh 2",
    },
    {
      geocode: [-4.1282987, 104.1392463, 10],
      popup: "Ini Contoh 3",
    },
    {
      geocode: [-4.1293987, 104.1492463, 10],
      popup: "Ini Contoh 4",
    },
  ];

  const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={false}
      className="w-full"
      style={{ minHeight: 500 }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, i) => (
        <Marker
          key={i}
          position={[marker.geocode[0], marker.geocode[1]]}
          icon={customIcon}
        >
          <Popup>{marker.popup}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
