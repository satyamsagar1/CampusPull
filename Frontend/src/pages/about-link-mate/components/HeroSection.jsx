import React from "react";

const HeroSection = () => {
  return (
    <section className="text-center py-16 bg-gradient-to-r from-blue-100 to-purple-100 mb-12 rounded-2xl">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
        About <span className="text-blue-600">LinkMate</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        LinkMate is your companion for growth – bringing together students,
        alumni, and faculty into one connected ecosystem.
      </p>
    </section>
  );
};

export default HeroSection;
