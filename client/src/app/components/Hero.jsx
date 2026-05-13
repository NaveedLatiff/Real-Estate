  "use client"
  import React, { useState } from "react"
  import { HiSearch } from "react-icons/hi"

  const Hero = () => {
    const types = ["Buy", "Rent"]
    const [query, setQuery] = useState({
      type: "Buy",
      location: "",
      minPrice: 0,
      maxPrice: 0,
    })

    const switchType = (type) => {
      setQuery((prev) => ({ ...prev, type }))
    }

    return (
      <section className="w-full flex items-center pt-4 font-poppins">
        <div className="container mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Side */}
          <div className="flex flex-col justify-center items-start space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight dark:text-white font-roboto">
              Find Real Estate & <br/> Get Your Dream Place
            </h1>

            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
              explicabo suscipit cum eius, iure est nulla animi consequatur
              facilis id pariatur fugit quos laudantium temporibus dolor ea
              repellat provident impedit!
            </p>

            {/* Search Types */}
            <div className="w-full max-w-2xl">
              {/* Tabs */}
              <div className="flex">
                {types.map((type) => (
                  <button
                    key={type}
                    className={`cursor-pointer px-5 py-2 ${query.type === type ? "bg-black text-white" : "bg-white text-black"} font-medium rounded-t-sm border border-black`}
                    onClick={() => switchType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Search Fields */}
              <div className="flex flex-col   md:gap-2 md:flex-row  md:items-center bg-white border border-gray-200 shadow-sm">
                <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-400">
                  <input
                    type="text"
                    placeholder="City Location"
                    className="w-full outline-none text-sm text-black placeholder:text-gray-400"
                  />
                </div>
                <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-400 ">
                  <input
                    type="number"
                    placeholder="Min Price"
                    className="w-full outline-none text-sm text-black placeholder:text-gray-400"
                  />
                </div>
                <div className="flex-1 px-4 py-3">
                  <input
                    type="number"
                    placeholder="Max Price"
                    className="w-full outline-none text-sm text-black placeholder:text-gray-400"
                  />
                </div>
                <button className="bg-purple-500 cursor-pointer p-4 md:p-3 flex items-center justify-center transition-colors hover:bg-purple-600">
                  <HiSearch size={24} className="text-white" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-12 pt-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold dark:text-white font-roboto">
                  16+
                </h2>
                <p className="text-gray-500 text-xs md:text-sm">
                  Years of Experience
                </p>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold dark:text-white font-roboto">
                  200
                </h2>
                <p className="text-gray-500 text-xs md:text-sm">Award Gained</p>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold dark:text-white font-roboto">
                  1200+
                </h2>
                <p className="text-gray-500 text-xs md:text-sm">Property Ready</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden lg:block w-full h-full"></div>
        </div>
      </section>
    )
  }

  export default Hero
