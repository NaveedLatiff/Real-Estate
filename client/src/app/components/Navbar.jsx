"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX, HiMoon, HiSun } from "react-icons/hi";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { useTheme } from "@/app/context/ThemeContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Agents", href: "/agents" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <nav className="flex items-center justify-between px-6 md:px-16 py-4">
        
        {/* Logo - Uses Poppins */}
        <Link href="/" className="flex items-center gap-2 text-foreground font-heading">
          <div className="bg-main-purple p-1.5 rounded-lg">
            <HiOutlineHomeModern className="text-white text-2xl" />
          </div>
          <span className="text-xl font-bold tracking-tight">LamaEstate</span>
        </Link>

        {/* Desktop Nav - Uses Inter (Default) */}
        <ul className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                href={link.href} 
                className="text-sm font-medium text-gray-500 hover:text-main-purple dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground transition-all"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <HiMoon size={22} /> : <HiSun size={22} />}
          </button>
          
          <Link href="/signin" className="text-sm font-medium text-gray-500 hover:text-main-purple dark:text-gray-400">
            Sign in
          </Link>
          <Link 
            href="/signup" 
            className="bg-main-purple text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:opacity-90 transition-all shadow-sm"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={toggleTheme} className="text-2xl text-foreground">
            {theme === "light" ? <HiMoon /> : <HiSun />}
          </button>
          <button 
            className="text-3xl text-foreground" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-t border-gray-100 dark:border-gray-800 flex flex-col md:hidden p-6 gap-2 shadow-xl">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-lg py-3 text-foreground border-b border-gray-50 dark:border-gray-900" 
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/signup" 
            className="mt-4 bg-main-purple text-white text-center py-3 rounded-md font-bold"
            onClick={() => setMenuOpen(false)}
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}