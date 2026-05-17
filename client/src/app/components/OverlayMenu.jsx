"use client";
import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext.jsx";

const OverlayMenu = ({ isOpen, toggleMenu, menuIconPosition }) => {
  const { user, logout } = useAuth()
  const overlayRef = useRef(null)
  const linksRef = useRef([])

  useEffect(() => {
    const xPercent = (menuIconPosition.x / window.innerWidth) * 100
    const yPercent = (menuIconPosition.y / window.innerHeight) * 100

    if (isOpen) {
      document.body.style.overflow = "hidden"
      gsap.set(overlayRef.current, { display: "flex" })
      gsap.fromTo(
        overlayRef.current,
        { clipPath: `circle(0% at ${xPercent}% ${yPercent}%)` },
        {
          clipPath: `circle(150% at ${xPercent}% ${yPercent}%)`,
          duration: 0.8,
          ease: "power3.inOut",
        }
      )
      gsap.fromTo(
        linksRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.4,
          ease: "power2.out",
        }
      )
    } else {
      document.body.style.overflow = "unset"
      gsap.to(overlayRef.current, {
        clipPath: `circle(0% at ${xPercent}% ${yPercent}%)`,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" })
        },
      })
    }
  }, [isOpen, menuIconPosition])

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Post Ad", path: "/post" },
    { name: "Properties", path: "/list" },
    { name: "Chats", path: "/chat" },    
  ]

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-black/95 hidden flex-col"
      style={{ clipPath: "circle(0% at 50% 50%)" }}
    >
      <div className="w-full px-6 md:px-10 lg:px-16 py-3 flex justify-between items-center shrink-0">
        <Link href="/">
          <span className="text-lg sm:text-2xl font-bold text-white italic font-poppins">
            LamaEstate
          </span>
        </Link>
        <button
          onClick={toggleMenu}
          className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-all cursor-pointer"
        >
          <IoClose size={28} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 w-full px-6 font-roboto">
          {menuItems.map((item, index) => (
            <div key={item.name} ref={(el) => (linksRef.current[index] = el)}>
              <Link
                href={item.path}
                onClick={toggleMenu}
                className="w-full text-2xl  md:text-3xl font-bold text-white transition-all uppercase leading-tight md:hover:text-4xl hover:text-purple-900"
              >
                {item.name}
              </Link>
            </div>
          ))}

          
        </div>
      </div>
    </div>
  )
}

export default OverlayMenu