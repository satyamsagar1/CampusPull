import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


export default function HeroSection() {
  const [showContent, setShowContent] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative flex items-center justify-center h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted={isMuted} // start muted (required for autoplay)
        playsInline
        onEnded={() => setShowContent(true)} // Show content after video ends
        controls={false}
      >
        <source src="/assets/images/intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute top-6  right-6 z-20 px-4 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700"
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>

      {/* Content (appears after video ends) */}
      {showContent && (
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white">
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
        </div>
      )}
    </section>
  );
}
