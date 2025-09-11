import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const FounderStory = () => {
  const founders = [
    {
      id: 1,
      name: "Arjun Sharma",
      role: "Co-Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      education: "IIT Delhi, Computer Science",
      story: `During my final year at IIT Delhi, I watched countless talented students struggle with placement preparation while our successful alumni remained disconnected from campus life. The gap was heartbreaking - students desperately needed guidance that alumni were eager to provide, but there was no meaningful bridge between them.`,
      motivation: "Building LinkeMate became my mission to ensure no student faces these challenges alone."
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Co-Founder & CTO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      education: "BITS Pilani, Information Technology",
      story: `As a first-generation college student, I often felt lost navigating academic and career decisions. I spent countless hours searching for the right resources, study materials, and career guidance. The information existed, but it was scattered and inaccessible to students who needed it most.`,
      motivation: "LinkeMate represents my commitment to democratizing access to quality education and mentorship."
    }
  ];

  return (
    <section className="py-20 bg-knowledge-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-academic-blue/10 rounded-full px-6 py-3 mb-6">
            <Icon name="Users" size={20} color="var(--color-academic-blue)" />
            <span className="text-sm font-inter font-medium text-academic-blue">Our Story</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-wisdom-charcoal mb-6">
            Born from Personal Experience
          </h2>
          <p className="text-xl text-insight-gray max-w-3xl mx-auto font-inter leading-relaxed">
            LinkeMate was founded by students who experienced firsthand the challenges of navigating university life without proper guidance and support.
          </p>
        </div>

        {/* Founders Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {founders?.map((founder, index) => (
            <div key={founder?.id} className="group">
              <div className="bg-white rounded-3xl p-8 shadow-brand-lg hover:shadow-brand-xl transition-all duration-500 knowledge-card">
                {/* Founder Image & Info */}
                <div className="flex items-start space-x-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-brand-md">
                      <Image 
                        src={founder?.image} 
                        alt={founder?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-academic-blue rounded-full flex items-center justify-center shadow-brand-sm">
                      <Icon name="Sparkles" size={16} color="white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-poppins font-bold text-wisdom-charcoal mb-2">
                      {founder?.name}
                    </h3>
                    <p className="text-academic-blue font-inter font-semibold mb-2">
                      {founder?.role}
                    </p>
                    <div className="flex items-center space-x-2 text-insight-gray">
                      <Icon name="GraduationCap" size={16} />
                      <span className="text-sm font-inter">{founder?.education}</span>
                    </div>
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-6">
                  <div className="relative">
                    <Icon 
                      name="Quote" 
                      size={32} 
                      color="var(--color-academic-blue)" 
                      className="absolute -top-2 -left-2 opacity-20"
                    />
                    <p className="text-wisdom-charcoal font-inter leading-relaxed text-lg pl-8">
                      {founder?.story}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-academic-blue/5 to-achievement-amber/5 rounded-2xl p-6 border-l-4 border-academic-blue">
                    <p className="text-academic-blue font-inter font-semibold italic">
                      "{founder?.motivation}"
                    </p>
                  </div>
                </div>

                {/* Achievement Highlights */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-poppins font-bold text-academic-blue">5+</div>
                      <div className="text-xs text-insight-gray font-inter">Years Experience</div>
                    </div>
                    <div>
                      <div className="text-2xl font-poppins font-bold text-progress-emerald">10K+</div>
                      <div className="text-xs text-insight-gray font-inter">Students Impacted</div>
                    </div>
                    <div>
                      <div className="text-2xl font-poppins font-bold text-achievement-amber">50+</div>
                      <div className="text-xs text-insight-gray font-inter">Awards Won</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Inspiration Quote */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-academic-blue to-credibility-indigo rounded-3xl p-12 text-white">
            <Icon name="Heart" size={48} color="white" className="mx-auto mb-6 opacity-80" />
            <blockquote className="text-2xl sm:text-3xl font-poppins font-semibold mb-6 leading-relaxed">
              "Every student deserves a mentor, every question deserves an answer, and every dream deserves a pathway to success."
            </blockquote>
            <p className="text-lg font-inter opacity-90">
              - The founding principle that drives everything we do at LinkeMate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStory;