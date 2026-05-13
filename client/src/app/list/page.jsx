"use client";
import "../lib/leaflet";
import Filter from "../components/Filter.jsx";
import Card from "../components/Card.jsx";
import { listings } from "../lib/dummyData.js";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Pin from "../components/Pin.jsx";

const page = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-3 h-full overflow-y-scroll scrollbar-hide px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-6">
          <Filter />
          <div className="flex flex-col py-2.5">
            {listings.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:flex-[2] bg-zinc-100 dark:bg-zinc-900 h-full relative">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={1}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {listings.map((item) => (
            <Pin key={item.id} item={item} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default page;
