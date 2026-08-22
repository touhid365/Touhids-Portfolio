"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <Link
              href="#home"
              className="flex items-center gap-2 sm:gap-3 group"
            >
              {/* Logo Image */}
              <div className="relative h-6 w-6 sm:h-10 sm:w-10 rounded-lg overflow-hidden bg-gradient-to-br from-white to-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                <Image
                  src="/images/logo.png"
                  alt="Touhid Portfolio Logo"
                  fill
                  className="object-cover p-1"
                  priority
                />
              </div>
              
              {/* Brand Name */}
              <div className="flex items-baseline">
                <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">
                  𝕋𝕠𝕦𝕙𝕚𝕕
                </span>
                <span className="text-gray-800 dark:text-white font-serif text-lg sm:text-xl ml-1 underline decoration-blue-400/30 underline-offset-4">
                  𝒫𝑜𝓇𝓉𝒻𝑜𝓁𝒾𝑜
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Menu - Center/Right */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 border-l-2 border-transparent hover:border-blue-500"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}