import Image from "next/image";
import { Marker, Popup } from "react-leaflet";

const Pin = ({ item }) => {
  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="flex flex-col gap-1 w-40">
          <div className="relative h-24 w-full">
            <Image
              src={item.images[0]}
              alt={item.title}
              width={160}
              height={100}
              className="object-cover rounded w-full h-24"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold m-0 leading-tight">
              {item.title}
            </h3>
            <span className="text-xs text-gray-500">{item.address}</span>
            <p className="text-sm text-purple-600 font-semibold">
              ${item.price}
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default Pin;
