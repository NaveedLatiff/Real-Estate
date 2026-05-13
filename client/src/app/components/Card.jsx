import Link from "next/link"
import { HiOutlineLocationMarker, HiOutlineChatAlt2, HiOutlineBookmark } from "react-icons/hi"
import { IoBedOutline } from "react-icons/io5"
import { LuBath } from "react-icons/lu"

const Card = ({ item }) => {
  return (
    <div className="flex flex-col md:flex-row gap-5 font-poppins py-4">
    
      <Link href={`/${item.id}`} className="flex-2 h-48 md:h-40 lg:h-48 overflow-hidden rounded-lg">
        <img 
          src={item.img} 
          alt={item.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="flex-3 flex flex-col justify-between py-1">
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-roboto dark:text-white truncate">
            <Link href={`/${item.id}`}>{item.title}</Link>
          </h2>
          <p className="flex items-center gap-1 text-gray-500 text-sm">
            <HiOutlineLocationMarker />
            <span>{item.address}</span>
          </p>
          <p className=" text-white bg-purple-500 px-2 py-1 rounded inline-block font-semibold">
            $ {item.price}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-4 items-center">
            <div className="text-black flex items-center gap-1 text-sm bg-gray-100  px-2 py-1 rounded">
              <IoBedOutline />
              <span>{item.bedRooms} bedroom</span>
            </div>
            <div className="text-black flex items-center gap-1 text-sm bg-gray-100  px-2 py-1 rounded">
              <LuBath />
              <span>{item.bathRooms} bathroom</span>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button className="p-2 border cursor-pointer border-gray-300 rounded ">
               <HiOutlineBookmark />
             </button>
             <button className="p-2 border cursor-pointer   border-gray-300 rounded  ">
               <HiOutlineChatAlt2 />
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card