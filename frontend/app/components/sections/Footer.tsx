'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FaGithub, FaLinkedin, FaArrowUp, FaHeart } from 'react-icons/fa'
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand with Logo */}
          <div>
            <Link href="#home" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 shadow-lg shadow-blue-500/20">
                <Image
                  src="/images/logo.png"
                  alt="Touhid Portfolio Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-400">
                  𝕋𝕠𝕦𝕙𝕚𝕕 <span className="text-gray-400">𝒫𝑜𝓇𝓉𝒻𝑜𝓁𝒾𝑜</span>
                </h3>
                <p className="text-gray-400 text-xs">
                  Code . Build . Grow — Turning ideas into scalable web apps.
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/touhid365/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/touhid-hossain-1155602bb/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://x.com/ami_touhid_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Signature */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Touhid Portfolio. All rights reserved.
          </p>
          
          {/* Signature Style */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Made with</span>
            <FaHeart className="text-red-500 animate-pulse" size={14} />
            <span className="text-gray-500">by</span>
            <span className="font-serif text-blue-400 font-semibold text-base tracking-wide hover:text-blue-300 transition-colors cursor-default">
              𝒯𝑜𝓊𝒽𝒾𝒹
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            aria-label="Back to top"
          >
            <FaArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  )
}