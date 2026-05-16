"use client"

import "../lib/leaflet"
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import Pin from "./Pin"

const SingleMap = ({ lat, lng, data }) => (
  <MapContainer
    center={[lat, lng]}
    zoom={13}
    scrollWheelZoom={false}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer
      attribution="&copy OpenStreetMap contributors"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Pin item={data} />
  </MapContainer>
)

export default SingleMap