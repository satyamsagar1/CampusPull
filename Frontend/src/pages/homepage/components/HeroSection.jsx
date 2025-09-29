import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold mb-6"
      >
        Welcome to CampusPull
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg md:text-xl mb-8"
      >
        Your trusted platform to connect and grow.
      </motion.p>

      <div className="flex gap-4">

        <Link to="/explore">
          <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-purple-700 transition">
            Get Started
          </button>
        </Link>
      </div>
    </section>
  );
}

