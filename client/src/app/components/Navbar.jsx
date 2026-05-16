"use client";
import React, { useState, useRef, useEffect } from "react";
import { HiMenu, HiSun, HiMoon } from "react-icons/hi";
import gsap from "gsap";
import OverlayMenu from "./OverlayMenu";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuIconPosition, setMenuIconPosition] = useState({ x: 0, y: 0 });
  const [showNavbar, setShowNavbar] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMd, setIsMd] = useState(false);
  const { user, logout } = useAuth();

  const menuButtonRef = useRef(null);
  const navRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const check = () => setIsMd(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      newDarkMode ? root.classList.add("dark") : root.classList.remove("dark");
    }
  };

  useEffect(() => {
    const updatePosition = () => {
      if (menuButtonRef.current) {
        const rect = menuButtonRef.current.getBoundingClientRect();
        setMenuIconPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  useEffect(() => {
    const travel = isMd ? 32 : 28;
    gsap.to("#theme-handle", {
      x: isDarkMode ? 0 : travel,
      duration: 0.4,
      ease: "back.out(1.2)",
    });
  }, [isDarkMode, isMd]);

  return (
    <>
      <nav
        ref={navRef}
        className={`flex flex-col w-full z-[9998] transform ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="relative w-full px-6 md:px-10 lg:px-16 py-3 flex items-center">
          <div className="absolute left-6 md:left-10 lg:left-16">
            <Link href="/">
              <button className="text-lg sm:text-2xl font-bold italic font-poppins bg-transparent border-none cursor-pointer ">
                LamaEstate
              </button>
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="mx-auto flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 dark:text-white"
          >
            <HiMenu size={26} />
          </button>

          <div className="absolute right-6 md:right-10 lg:right-16 flex items-center gap-3">
            <div
              onClick={toggleTheme}
              className="relative w-14 h-7 md:w-18 md:h-9 flex items-center bg-gray-300 dark:bg-purple-900/40 rounded-full cursor-pointer transition-colors duration-500 shrink-0"
            >
              <div className="flex justify-between w-full px-1 text-gray-500">
                <HiMoon size={14} />
                <HiSun size={14} />
              </div>
              <div
                id="theme-handle"
                className="absolute left-1 w-5 h-5 md:w-8 md:h-8 bg-white rounded-full shadow-md flex items-center justify-center"
                style={{
                  transform: isDarkMode
                    ? "translateX(0px)"
                    : `translateX(${isMd ? 32 : 28}px)`,
                }}
              >
                {isDarkMode ? (
                  <HiMoon className="text-purple-900" size={isMd ? 16 : 12} />
                ) : (
                  <HiSun className="" size={isMd ? 16 : 12} />
                )}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 ">
              {mounted &&
                (user ? (
                  <>
                    <Link href="/profile-page">
                      <button className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold cursor-pointer rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shrink-0 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all tracking-wide">
                        Profile
                      </button>
                    </Link>
                    <button
                      onClick={logout}
                      className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs  sm:text-sm font-semibold cursor-pointer rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shrink-0 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all tracking-wide"
                    >
                      Logout
                    </button>
                    <Link href="/my">
                      <button className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold cursor-pointer rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shrink-0 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all tracking-wide">
                        My Posts
                      </button>
                    </Link>

                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <button className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold cursor-pointer rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shrink-0 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all tracking-wide">
                        Log In
                      </button>
                    </Link>
                    <Link href="/login">
                      <button className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold cursor-pointer rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shrink-0 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all tracking-wide">
                        Sign Up
                      </button>
                    </Link>
                  </>
                ))}
            </div>
          </div>
        </div>

        <div className="flex lg:hidden justify-center items-center gap-3 pb-3">
          {mounted &&
            (user ? (
              <>
                <Link href="/profile-page">
                  <button className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold cursor-pointer rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shrink-0 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all tracking-wide">
                    Profile
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs  sm:text-sm font-semibold cursor-pointer rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shrink-0 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all tracking-wide"
                >
                  Logout
                </button>
                <Link href="/my">
                  <button className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold cursor-pointer rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shrink-0 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all tracking-wide">
                    My Posts
                  </button>
                </Link>

              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold cursor-pointer rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shrink-0 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all tracking-wide">
                    Log In
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold cursor-pointer rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shrink-0 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all tracking-wide">
                    Sign Up
                  </button>
                </Link>
              </>
            ))}
        </div>
      </nav>

      <OverlayMenu
        isOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        menuIconPosition={menuIconPosition}
      />
    </>
  );
};

export default Navbar;
