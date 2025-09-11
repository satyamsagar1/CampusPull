import React from 'react';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-academic-blue via-credibility-indigo to-accent text-white py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 border border-white rounded-full"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Mission Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <Icon name="Target" size={20} color="white" />
            <span className="text-sm font-inter font-medium">Our Mission</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold mb-6 leading-tight">
            Knowledge Without
            <span className="block bg-gradient-to-r from-achievement-amber to-progress-emerald bg-clip-text text-transparent">
              Boundaries
            </span>
          </h1>

          {/* Mission Statement */}
          <p className="text-xl sm:text-2xl font-inter font-medium mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
            Transforming university networking by bridging the gap between ambitious students and successful alumni through shared knowledge, mentorship, and genuine connections.
          </p>

          {/* Vision Statement */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Icon name="Eye" size={24} color="white" />
              <h2 className="text-2xl font-poppins font-semibold">Our Vision</h2>
            </div>
            <p className="text-lg font-inter leading-relaxed opacity-90">
              To create a world where every student has access to the wisdom, resources, and opportunities they need to succeed, regardless of their background or circumstances.
            </p>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { number: "50K+", label: "Students Helped" },
              { number: "2.5K+", label: "Alumni Mentors" },
              { number: "100+", label: "Universities" },
              { number: "95%", label: "Success Rate" }
            ]?.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-poppins font-bold text-achievement-amber mb-2">
                  {stat?.number}
                </div>
                <div className="text-sm font-inter opacity-80">{stat?.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;