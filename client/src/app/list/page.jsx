'use client'
import Filter from "../components/Filter.jsx";
import Card from "../components/Card.jsx";
import { listings } from "../lib/dummyData.js";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const page = () => {
  return (
    <div className="flex h-screen overflow-hidden">
    
      <div className="flex-[3] h-full overflow-y-scroll scrollbar-hide px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-6">
          <Filter />
          <div className="flex flex-col">
            {listings.map(item => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:flex-[2] bg-zinc-100 dark:bg-zinc-900 h-full relative">
       <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[51.505, -0.09]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</MapContainer>
      </div>
    </div>
  );
};

export default page;