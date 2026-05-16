"use client"
import React from "react"

const Hero = () => {
  return (
    <section className="w-full min-h-[calc(100vh-80px)] flex items-center font-poppins overflow-hidden relative  ">


      <div className="relative w-full px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        <div className="flex flex-col justify-center items-start space-y-8">

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-300/40 dark:border-purple-700/40 bg-purple-50/60 dark:bg-purple-900/20">
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300 tracking-wide uppercase">
              Top Real Estate Company
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight dark:text-white">
            Find Real Estate &{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-violet-500 dark:from-purple-400 dark:to-violet-300">
                Dream Place
              </span>
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                <path d="M0 5 Q50 0 100 5 Q150 10 200 5" stroke="url(#ug)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="ug" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#7c3aed"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
            explicabo suscipit cum eius, iure est nulla animi consequatur
            facilis id pariatur fugit quos laudantium temporibus dolor ea
            repellat provident impedit!
          </p>

          <div className="flex items-center gap-8 pt-2">
            {[
              { value: "16K+", label: "Listings" },
              { value: "98%", label: "Happy Clients" },
              { value: "12+", label: "Years Experience" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-xl font-extrabold text-purple-700 dark:text-purple-400">{s.value}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-full h-full" />
      </div>
    </section>
  )
}

export default Hero