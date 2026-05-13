"use client"
import React, { useState, useRef, useEffect } from "react"
import { HiMenu, HiSun, HiMoon } from "react-icons/hi"
import gsap from "gsap"
import OverlayMenu from "./OverlayMenu"
import Link from "next/link"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuIconPosition, setMenuIconPosition] = useState({ x: 0, y: 0 })
  const [showNavbar, setShowNavbar] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const menuButtonRef = useRef(null)
  const navRef = useRef(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    if (typeof document !== "undefined") {
      const root = document.documentElement
      newDarkMode ? root.classList.add("dark") : root.classList.remove("dark")
    }
  }

  useEffect(() => {
    const updatePosition = () => {
      if (menuButtonRef.current) {
        const rect = menuButtonRef.current.getBoundingClientRect()
        setMenuIconPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      }
    }
    updatePosition()
    window.addEventListener("resize", updatePosition)
    return () => window.removeEventListener("resize", updatePosition)
  }, [])

  useEffect(() => {
    gsap.to("#theme-handle", {
      x: isDarkMode ? 0 : 32,
      duration: 0.4,
      ease: "back.out(1.2)"
    })
  }, [isDarkMode])

  
  return (
    <>
     <nav
        ref={navRef}
        className={`flex justify-between items-center  w-full z-[9998] transition-all duration-500 transform ${showNavbar ? "translate-y-0" : "-translate-y-full"} `}
      >
        <div className="relative w-full px-6 md:px-10 lg:px-16 py-3 flex items-center justify-center">
          
          <div className="absolute left-6 md:left-10 lg:left-16">
             <Link href="/">
            <button className="text-lg  sm:text-2xl font-bold italic font-poppins bg-transparent border-none cursor-pointer transition-colors duration-300 dark:text-white">
              LamaEstate
            </button>
             </Link>
          </div>

          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="flex items-center justify-center w-5 h-5 sm:w-10 sm:h-10 rounded-full transition-all cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 dark:text-white"
          >
            <HiMenu size={26} />
          </button>

          <div className="absolute right-6 md:right-10 lg:right-16 flex items-center gap-6">
          
            <div
              onClick={toggleTheme}
              className="relative w-14 h-7 flex items-center bg-gray-300 dark:bg-purple-900/40 rounded-full p-1 cursor-pointer transition-colors duration-500 shrink-0"
            >
              <div className="flex justify-between w-full px-1 text-gray-500">
                <HiMoon size={14} />
                <HiSun size={14} />
              </div>
              <div
                id="theme-handle"
                className="absolute w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                style={{ transform: isDarkMode ? "translateX(0px)" : "translateX(28px)" }}
              >
                {isDarkMode ? (
                  <HiMoon className="text-purple-900" size={12} />
                ) : (
                  <HiSun className="text-orange-500" size={12} />
                )}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3">
               <button className="px-5 py-2 rounded-2xl text-sm font-medium cursor-pointer bg-gradient-to-r from-purple-900 to-purple-600 text-white shrink-0">
                Log In
              </button>
              <button className="px-5 py-2 rounded-2xl text-sm font-medium cursor-pointer bg-gradient-to-r from-purple-900 to-purple-600 text-white shrink-0">
                Sign Up
              </button>
            </div>
          </div>

        </div>
      </nav>

      <OverlayMenu
        isOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        menuIconPosition={menuIconPosition}
      />
    </>
  )
}

export default Navbar