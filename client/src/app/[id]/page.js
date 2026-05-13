"use client"

import { useState } from "react"
import {
  HiOutlineLocationMarker,
  HiOutlineChatAlt2,
  HiOutlineBookmark,
  HiX,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi"
import { IoBedOutline, IoResizeOutline } from "react-icons/io5"
import {
  LuBath,
  LuUtilityPole,
  LuDog,
  LuSchool,
  LuBus,
  LuUtensils,
} from "react-icons/lu"
import { MdOutlineAttachMoney } from "react-icons/md"
import { MapContainer, TileLayer } from "react-leaflet"
import Pin from "../components/Pin"
import "leaflet/dist/leaflet.css"

const singlePostData = {
  id: 1,
  title: "Beautiful Apartment",
  price: 1200,
  images: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
  ],
  bedRooms: 2,
  bathRooms: 1,
  size: 861,
  latitude: 51.5074,
  longitude: -0.1278,
  city: "London",
  address: "1234 Broadway St",
  school: "250m away",
  bus: "100m away",
  restaurant: "200m away",
  description:
    "Future alike hill pull picture swim magic chain seed engineer nest outer raise bound easy poetry gain loud weigh me recognize farmer bare danger. actually put square leg vessels earth engine matter key cup indeed body film century shut place environment were stage vertical roof bottom lady function breeze darkness beside tin view local breathe carbon swam declared magnet escape.",
}

export default function SinglePage({ params }) {
  const { id } = params
  const [sliderIndex, setSliderIndex] = useState(null)

  const changeSlide = (direction) => {
    if (direction === "left") {
      setSliderIndex((prev) => (prev === 0 ? singlePostData.images.length - 1 : prev - 1))
    } else {
      setSliderIndex((prev) => (prev === singlePostData.images.length - 1 ? 0 : prev + 1))
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen font-poppins relative">
      
      {sliderIndex !== null && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center overflow-hidden">
         
          <button 
            onClick={() => setSliderIndex(null)}
            className="cursor-pointer absolute top-5 right-5 text-white z-[10000] p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <HiX size={40} />
          </button>

          <button 
            onClick={() => changeSlide("left")}
            className="cursor-pointer absolute left-2 md:left-10 text-purple-800  z-[10000] p-2  rounded-full transition-colors"
          >
            <HiChevronLeft size={60} />
          </button>

          <div className="w-[90%] h-[70%] md:w-[80%] md:h-[80%] flex items-center justify-center">
            <img
              src={singlePostData.images[sliderIndex]}
              alt={`Slide ${sliderIndex}`}
              /* object-cover ensures they all fill the same visual space regardless of original size */
              className="w-full h-full object-cover md:object-contain rounded-sm shadow-2xl transition-all duration-300"
            />
          </div>

          <button 
            onClick={() => changeSlide("right")}
            className="cursor-pointer absolute right-2 md:right-10 text-purple-800  z-[10000] p-2  rounded-full transition-colors"
          >
            <HiChevronRight size={60} />
          </button>
          
          <div className="absolute bottom-6 text-white font-bold tracking-widest bg-black/40 px-6 py-2 rounded-full border border-white/20">
            {sliderIndex + 1} / {singlePostData.images.length}
          </div>
        </div>
      )}

      <div className="flex-3 p-5 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[400px]">
            <div className="flex-3 h-64 md:h-full">
              <img
                src={singlePostData.images[0]}
                alt=""
                onClick={() => setSliderIndex(0)}
                className="w-full h-full object-cover rounded-xl cursor-pointer hover:brightness-90 transition-all"
              />
            </div>
            <div className="flex-1 flex flex-row md:flex-col gap-4 h-32 md:h-full">
              {singlePostData.images.slice(1, 4).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  onClick={() => setSliderIndex(index + 1)}
                  className="w-1/4 md:w-full h-full md:h-1/3 object-cover rounded-xl cursor-pointer hover:brightness-90 transition-all"
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-roboto">
              {singlePostData.title}
            </h1>
            <div className="flex items-center gap-1 text-gray-500">
              <HiOutlineLocationMarker size={20} />
              <span>{singlePostData.address}</span>
            </div>
            <p className="text-white bg-purple-500 px-3 py-1 rounded-md inline-block font-bold text-lg">
              $ {singlePostData.price}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
            {singlePostData.description}
          </p>
        </div>
      </div>

      <div className="flex-2 p-5 lg:p-8 space-y-8">
        <div>
          <h3 className="font-bold text-lg mb-4 font-roboto">General</h3>
          <div className="p-4 rounded-xl space-y-4 shadow-sm ">
            <div className="flex items-center gap-3">
              <LuUtilityPole className="text-purple-600" size={24} />
              <div>
                <p className="font-bold text-sm">Utilities</p>
                <p className="text-xs text-gray-500">Renter is responsible</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LuDog className="text-purple-600" size={24} />
              <div>
                <p className="font-bold text-sm">Pet Policy</p>
                <p className="text-xs text-gray-500">Pets Allowed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MdOutlineAttachMoney className="text-purple-600" size={24} />
              <div>
                <p className="font-bold text-sm">Property Fees</p>
                <p className="text-xs text-gray-500">Must have 3x the rent</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 font-roboto">Room Sizes</h3>
          <div className="flex flex-wrap gap-4">
            <div className="p-2 rounded-md flex items-center gap-2 flex-1 min-w-[120px] shadow-sm">
              <IoResizeOutline className="text-purple-600" />
              <span className="text-xs font-semibold">{singlePostData.size}sqft</span>
            </div>
            <div className="p-2 rounded-md flex items-center gap-2 flex-1 min-w-[120px] shadow-sm">
              <IoBedOutline className="text-purple-600" />
              <span className="text-xs font-semibold">{singlePostData.bedRooms} bed</span>
            </div>
            <div className="p-2 rounded-md flex items-center gap-2 flex-1 min-w-[120px] shadow-sm">
              <LuBath className="text-purple-600" />
              <span className="text-xs font-semibold">{singlePostData.bathRooms} bath</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 font-roboto">Nearby Places</h3>
          <div className="p-4 rounded-xl flex justify-between shadow-sm ">
            <div className="flex items-center justify-center gap-2">
              <LuSchool className="text-purple-600" />
              <div>
                <p className="text-xs font-bold">School</p>
                <p className="text-[10px] ">{singlePostData.school}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LuBus className="text-purple-600" />
              <div>
                <p className="text-xs font-bold">Bus Stop</p>
                <p className="text-[10px] text-gray-400">{singlePostData.bus}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LuUtensils className="text-purple-600" />
              <div>
                <p className="text-xs font-bold">Restaurant</p>
                <p className="text-[10px] text-gray-400">{singlePostData.restaurant}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 font-roboto">Location</h3>
          <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-white shadow-inner relative">
            <MapContainer
              center={[singlePostData.latitude, singlePostData.longitude]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Pin item={singlePostData} />
            </MapContainer>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 border py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors ">
            <HiOutlineChatAlt2 /> Send a Message
          </button>
          <button className="flex-1 border py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors ">
            <HiOutlineBookmark /> Save the Place
          </button>
        </div>
      </div>
    </div>
  )
}