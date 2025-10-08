import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Added for navigation
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AlumniSpotlight = () => {
  const navigate = useNavigate(); // ✅ useNavigate instance

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const alumniStories = [
    {
      id: 1,
      name: "Swati Yadav",
      currentRole: " Software Engineer",
      company: "Black Orange",
      companyLogo: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=100",
      profileImage: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400",
      university: "ABESIT",
      graduationYear: "2026",
      mentorshipStatus: "Available",
      specialization: ["System Design", "Cloud Architecture", "Microservices"],
      quote: `The transition from college to corporate wasn't easy, but having the right guidance made all the difference. Now I want to be that bridge for the next generation.`,
      achievements: [
        "Led migration of legacy systems to cloud",
        "Mentored 15+ junior developers",
        "Speaker at 3 international conferences"
      ],
      beforeImage: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300",
      journey: {
        college: "Computer Science Student",
        firstJob: "IT Project Manager at Startup",
        current: " Engineer at BlackOrange"
      },
      menteeCount: 23,
      responseTime: "< 2 hours",
      rating: 4.9
    },
    {
      id: 2,
      name: "Sakshi Sharma",
      currentRole: "UI/UX Designer",
      company: "Indilearn",
      companyLogo: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=100",
      profileImage: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400",
      university: "ABESIT",
      graduationYear: "2026",
      mentorshipStatus: "Available",
      specialization: ["Product Strategy", "User Research", "Data Analytics"],
      quote: `From engineering to product management - the journey taught me that technical skills are just the foundation. Understanding users and business impact is what creates real value.`,
      achievements: [
        "Launched 2 products with 10M+ users",
        "Increased user engagement by 40%",
        "Built cross-functional teams of 20+"
      ],
      beforeImage: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300",
      journey: {
        college: "Electronics Engineering Student",
        firstJob: "Software Developer",
        current: "Product Manager at Google"
      },
      menteeCount: 31,
      responseTime: "< 4 hours",
      rating: 4.8
    },
    {
      id: 3,
      name: "Samayak Vansh",
      currentRole: "Data Science Lead",
      company: "Black Orange",
      companyLogo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100",
      profileImage: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400",
      university: "NIT Delhi",
      graduationYear: "2017",
      mentorshipStatus: "Limited Availability",
      specialization: ["Machine Learning", "Deep Learning", "MLOps"],
      quote: `Data science is not just about algorithms and models. It's about solving real business problems and creating impact. The key is to stay curious and keep learning.`,
      achievements: [
        "Built ML models serving 100M+ customers",
        "Published 8 research papers",
        "Led data science team of 12 engineers"
      ],
      beforeImage: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300",
      journey: {
        college: "Mathematics & Computing Student",
        firstJob: "Data Analyst",
        current: "Data Science Lead at Amazon"
      },
      menteeCount: 18,
      responseTime: "< 1 day",
      rating: 4.9
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % alumniStories?.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, alumniStories?.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % alumniStories?.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + alumniStories?.length) % alumniStories?.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const currentAlumni = alumniStories?.[currentSlide];

  return (
    <section className="py-16 bg-gradient-to-br from-surface to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-academic-blue rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-achievement-amber rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-wisdom-charcoal mb-4">
            Alumni and Placed Students Success Stories
          </h2>
          <p className="text-xl text-insight-gray font-inter max-w-2xl mx-auto">
            Learn from those who've walked the path before you. Connect with mentors who understand your journey.
          </p>
        </div>

        {/* Main Carousel */}
        <div className="relative">
          <div className="knowledge-card bg-white rounded-2xl shadow-brand-xl border border-slate-100 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              
              {/* Left Side - Alumni Profile */}
              <div className="p-8 lg:p-12">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-academic-blue">
                      <Image
                        src={currentAlumni?.profileImage}
                        alt={currentAlumni?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={currentAlumni?.companyLogo}
                        alt={currentAlumni?.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-poppins font-bold text-wisdom-charcoal mb-1">
                      {currentAlumni?.name}
                    </h3>
                    <p className="text-lg text-academic-blue font-inter font-semibold mb-1">
                      {currentAlumni?.currentRole}
                    </p>
                    <p className="text-insight-gray font-inter">
                      {currentAlumni?.company} • {currentAlumni?.university} '{currentAlumni?.graduationYear}
                    </p>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-inter font-medium ${
                    currentAlumni?.mentorshipStatus === 'Available' ?'bg-emerald-50 text-progress-emerald' :'bg-amber-50 text-achievement-amber'
                  }`}>
                    {currentAlumni?.mentorshipStatus}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-lg text-insight-gray font-inter leading-relaxed mb-6 italic">
                  "{currentAlumni?.quote}"
                </blockquote>

                {/* Specializations */}
                <div className="mb-6">
                  <h4 className="text-sm font-inter font-semibold text-wisdom-charcoal mb-3">
                    Expertise Areas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentAlumni?.specialization?.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-academic-blue/10 text-academic-blue text-sm font-inter font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mentor Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-poppins font-bold text-wisdom-charcoal">
                      {currentAlumni?.menteeCount}
                    </div>
                    <div className="text-xs text-insight-gray font-inter">
                      Mentees
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-poppins font-bold text-wisdom-charcoal">
                      {currentAlumni?.rating}
                    </div>
                    <div className="text-xs text-insight-gray font-inter">
                      Rating
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-poppins font-bold text-wisdom-charcoal">
                      {currentAlumni?.responseTime}
                    </div>
                    <div className="text-xs text-insight-gray font-inter">
                      Response
                    </div>
                  </div>
                </div>

                {/* Connect Button */}
                <button className="w-full bg-academic-blue hover:bg-blue-700 text-white font-inter font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-brand-md hover:shadow-brand-lg flex items-center justify-center space-x-2">
                  <Icon name="MessageCircle" size={18} />
                  <span>Connect as Mentor</span>
                </button>
              </div>

              {/* Right Side - Journey Visualization */}
              <div className="bg-gradient-to-br from-academic-blue/5 to-credibility-indigo/5 p-8 lg:p-12">
                <h4 className="text-xl font-poppins font-bold text-wisdom-charcoal mb-8">
                  Career Journey
                </h4>

                {/* Journey Timeline */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center">
                      <Icon name="GraduationCap" size={20} color="var(--color-insight-gray)" />
                    </div>
                    <div>
                      <p className="font-inter font-semibold text-wisdom-charcoal">
                        {currentAlumni?.journey?.college}
                      </p>
                      <p className="text-sm text-insight-gray">
                        {currentAlumni?.university}
                      </p>
                    </div>
                  </div>

                  <div className="ml-6 border-l-2 border-dashed border-slate-300 h-8"></div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-achievement-amber/20 rounded-full flex items-center justify-center">
                      <Icon name="Briefcase" size={20} color="var(--color-achievement-amber)" />
                    </div>
                    <div>
                      <p className="font-inter font-semibold text-wisdom-charcoal">
                        {currentAlumni?.journey?.firstJob}
                      </p>
                      <p className="text-sm text-insight-gray">
                        First Professional Role
                      </p>
                    </div>
                  </div>

                  <div className="ml-6 border-l-2 border-dashed border-slate-300 h-8"></div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-academic-blue/20 rounded-full flex items-center justify-center">
                      <Icon name="Trophy" size={20} color="var(--color-academic-blue)" />
                    </div>
                    <div>
                      <p className="font-inter font-semibold text-wisdom-charcoal">
                        {currentAlumni?.journey?.current}
                      </p>
                      <p className="text-sm text-insight-gray">
                        Current Position
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Achievements */}
                <div>
                  <h5 className="text-lg font-inter font-semibold text-wisdom-charcoal mb-4">
                    Key Achievements
                  </h5>
                  <div className="space-y-3">
                    {currentAlumni?.achievements?.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-progress-emerald rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-insight-gray font-inter leading-relaxed">
                          {achievement}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-academic-blue text-academic-blue hover:text-white rounded-full shadow-brand-md hover:shadow-brand-lg transition-all duration-300 flex items-center justify-center z-10"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-academic-blue text-academic-blue hover:text-white rounded-full shadow-brand-md hover:shadow-brand-lg transition-all duration-300 flex items-center justify-center z-10"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-3 mt-8">
          {alumniStories?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-academic-blue scale-125' :'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* View All Alumni Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/explore')} // ✅ Navigate to explore page
            className="inline-flex items-center space-x-2 px-8 py-3 bg-white hover:bg-academic-blue text-academic-blue hover:text-white border-2 border-academic-blue font-inter font-medium rounded-lg transition-all duration-300 shadow-brand-md hover:shadow-brand-lg"
          >
            <span>View All Alumni</span>
            <Icon name="Users" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AlumniSpotlight;
