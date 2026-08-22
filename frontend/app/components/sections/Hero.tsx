"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/app/components/ui/Button";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiCode } from "react-icons/hi";
import { MdEmail } from "react-icons/md";
import { useState, useEffect } from "react";

export default function Hero() {
  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "PHP Developer",
    "MERN Stack Developer",
  ];

  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = roles[currentRole];
      
      if (isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentRole((prev) => (prev + 1) % roles.length);
        setTypingSpeed(150);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRole, roles, typingSpeed]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-semibold">
                𝒲𝑒𝓁𝒸𝑜𝓂𝑒 𝓉𝑜 𝓂𝓎 𝓅𝑜𝓇𝓉𝒻𝑜𝓁𝒾𝑜
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold"
            >
              <span className="text-gray-900 dark:text-white">Hi, I'm </span>
              <span className="text-blue-600 dark:text-blue-400">
                𝐓𝐨𝐮𝐡𝐢𝐝 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-700 dark:text-gray-300"
            >
              <span className="font-medium">I am a</span>{" "}
              <span className="text-blue-600 dark:text-blue-400 font-semibold relative">
                <span className="inline-block min-w-[180px]">{displayText}</span>
                <span className="absolute right-[-8px] top-0 h-full w-0.5 bg-blue-500 animate-pulse"></span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-lg"
            >
              Turning ideas into scalable web apps with modern technologies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button href="#projects" variant="primary" size="lg" className="inline-flex items-center gap-2">
                <HiCode className="w-5 h-5" />
                View Projects
              </Button>
              <Button href="#contact" variant="secondary" size="lg" className="inline-flex items-center gap-2">
                <MdEmail className="w-5 h-5" />
                Contact Me
              </Button>
            </motion.div>

            {/* Email Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex items-center gap-2"
            >
              <FaEnvelope className="text-blue-500 dark:text-blue-400" size={16} />
              <a
                href="mailto:hello@touhidportfolio.com"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                hello@touhidportfolio.com
              </a>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4 pt-2"
            >
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Connect with me:
              </span>
              <div className="flex gap-3">
                <a
                  href="https://github.com/touhid365/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110"
                  aria-label="GitHub"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/touhid-hossain-1155602bb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href="https://x.com/ami_touhid_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110"
                  aria-label="X (Twitter)"
                >
                  <FaXTwitter size={20} />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <img
                  src="/images/touhid_profile.png"
                  alt="Touhid-Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}