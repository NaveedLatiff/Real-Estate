"use client"

import "../lib/leaflet"
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import Pin from "./Pin.jsx"

const Map = ({ posts }) => (
  <MapContainer
    center={[39.8283, -98.5795]}
    zoom={4}
    scrollWheelZoom={false}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer
      attribution="&copy OpenStreetMap contributors"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {posts.map((item) => (
      <Pin key={item.id} item={item} />
    ))}
  </MapContainer>
)

export default Map