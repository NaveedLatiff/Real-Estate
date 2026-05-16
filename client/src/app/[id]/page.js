"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Axios from "../../../axios";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  HiOutlineLocationMarker,
  HiOutlineChatAlt2,
  HiOutlineBookmark,
  HiX,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

import { IoBedOutline, IoResizeOutline } from "react-icons/io5";

import {
  LuBath,
  LuUtilityPole,
  LuDog,
  LuSchool,
  LuBus,
  LuUtensils,
} from "react-icons/lu";

import { MdOutlineAttachMoney } from "react-icons/md";

import "leaflet/dist/leaflet.css";
import Loader from "../components/Loader";
import Link from "next/link";
import MessageButton from "../components/Messagebutton";

const SingleMap = dynamic(() => import("../components/SingleMap"), { ssr: false });

export default function SinglePage({ params }) {
  const { id } = React.use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [sliderIndex, setSliderIndex] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await Axios.get(`/post/${id}`);
      setData(res.data.post);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await Axios.delete(`/post/${id}`);
      if (res.data.success) {
        toast.success("Post deleted successfully");
        router.push("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const changeSlide = (direction) => {
    if (direction === "left") {
      setSliderIndex((prev) =>
        prev === 0 ? data.images.length - 1 : prev - 1
      );
    } else {
      setSliderIndex((prev) =>
        prev === data.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const isOwner = user && data && user.id === data.userId;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center">
        Post not found
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen font-poppins relative">
      {sliderIndex !== null && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center overflow-hidden">
          <button
            onClick={() => setSliderIndex(null)}
            className="cursor-pointer absolute top-5 right-5 text-white z-[10000] p-2"
          >
            <HiX size={40} />
          </button>

          <button
            onClick={() => changeSlide("left")}
            className="cursor-pointer absolute left-2 md:left-10 text-white z-[10000]"
          >
            <HiChevronLeft size={60} />
          </button>

          <div className="w-[90%] h-[70%] md:w-[80%] md:h-[80%] flex items-center justify-center">
            <img
              src={data.images[sliderIndex]}
              alt=""
              className="w-full h-full object-cover md:object-contain rounded-sm"
            />
          </div>

          <button
            onClick={() => changeSlide("right")}
            className="cursor-pointer absolute right-2 md:right-10 text-white z-[10000]"
          >
            <HiChevronRight size={60} />
          </button>

          <div className="absolute bottom-6 text-white font-bold">
            {sliderIndex + 1} / {data.images.length}
          </div>
        </div>
      )}

      <div className="flex-3 p-5 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[400px]">
            <div className="flex-3 h-64 md:h-full">
              <img
                src={data.images[0]}
                alt=""
                onClick={() => setSliderIndex(0)}
                className="w-full h-full object-cover rounded-xl cursor-pointer"
              />
            </div>

            <div className="flex-1 flex flex-row md:flex-col gap-4 h-32 md:h-full">
              {data.images.slice(1, 4).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  onClick={() => setSliderIndex(index + 1)}
                  className="w-1/4 md:w-full h-full md:h-1/3 object-cover rounded-xl cursor-pointer"
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{data.title}</h1>

            <div className="flex items-center gap-1 text-gray-500">
              <HiOutlineLocationMarker size={20} />
              <span>{data.address}</span>
            </div>

            <p className="text-white bg-purple-500 px-3 py-1 rounded-md inline-block font-bold text-lg">
              $ {data.price}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
            {data.PostDetail.desc}
          </p>
        </div>
      </div>

      <div className="flex-2 p-5 lg:p-8 space-y-8">
        <div>
          <h3 className="font-bold text-lg mb-4">General</h3>
          <div className="p-4 rounded-xl space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <LuUtilityPole className="text-purple-600" size={24} />
              <div>
                <p className="font-bold text-sm">Utilities</p>
                <p className="text-xs text-gray-500">{data.PostDetail.utilities}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LuDog className="text-purple-600" size={24} />
              <div>
                <p className="font-bold text-sm">Pet Policy</p>
                <p className="text-xs text-gray-500">{data.PostDetail.pet}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MdOutlineAttachMoney className="text-purple-600" size={24} />
              <div>
                <p className="font-bold text-sm">Property Fees</p>
                <p className="text-xs text-gray-500">{data.PostDetail.income}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Room Sizes</h3>
          <div className="flex flex-wrap gap-4">
            <div className="p-2 rounded-md flex items-center gap-2 flex-1">
              <IoResizeOutline className="text-purple-600" />
              <span className="text-xs font-semibold">{data.PostDetail.size} sqft</span>
            </div>
            <div className="p-2 rounded-md flex items-center gap-2 flex-1">
              <IoBedOutline className="text-purple-600" />
              <span className="text-xs font-semibold">{data.bedroom} bed</span>
            </div>
            <div className="p-2 rounded-md flex items-center gap-2 flex-1">
              <LuBath className="text-purple-600" />
              <span className="text-xs font-semibold">{data.bathroom} bath</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Nearby Places</h3>
          <div className="p-4 rounded-xl flex justify-between shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <LuSchool className="text-purple-600" />
              <div>
                <p className="text-xs font-bold">School</p>
                <p className="text-[10px]">{data.PostDetail.school}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LuBus className="text-purple-600" />
              <div>
                <p className="text-xs font-bold">Bus Stop</p>
                <p className="text-[10px]">{data.PostDetail.bus}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LuUtensils className="text-purple-600" />
              <div>
                <p className="text-xs font-bold">Restaurant</p>
                <p className="text-[10px]">{data.PostDetail.restaurant}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Location</h3>
          <div className="w-full h-64 rounded-xl overflow-hidden">
            <SingleMap lat={data.latitude} lng={data.longitude} data={data} />
          </div>
        </div>

        <div className="flex gap-4">
          {isOwner ? (
            <>
              <button
                onClick={() => router.push(`/update/${id}`)}
                className="flex-1 py-3 rounded-md flex items-center justify-center gap-2 bg-gradient-to-r from-purple-900 to-purple-600 text-white cursor-pointer text-sm font-medium"
              >
                Update Post
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 border border-red-400 text-red-400 py-3 rounded-md flex items-center justify-center gap-2 cursor-pointer text-sm font-medium hover:bg-red-400 hover:text-white transition-all disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Post"}
              </button>
            </>
          ) : (
            <MessageButton ownerId={data.userId} />
          )}
        </div>
      </div>
    </div>
  );
}