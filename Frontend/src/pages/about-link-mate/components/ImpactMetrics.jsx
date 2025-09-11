import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ImpactMetrics = () => {
  const [animatedStats, setAnimatedStats] = useState({
    studentsHelped: 0,
    resourcesShared: 0,
    mentorConnections: 0,
    placementRate: 0,
    universitiesPartnered: 0,
    averageImprovement: 0
  });

  const finalStats = {
    studentsHelped: 52847,
    resourcesShared: 125630,
    mentorConnections: 18945,
    placementRate: 94.7,
    universitiesPartnered: 127,
    averageImprovement: 87.3
  };

  const impactStories = [
    {
      id: 1,
      category: "Academic Excellence",
      title: "Average Grade Improvement",
      value: "2.3 GPA",
      description: "Students using LinkeMate resources show significant academic improvement",
      icon: "TrendingUp",
      color: "progress-emerald"
    },
    {
      id: 2,
      category: "Career Success",
      title: "Faster Job Placement",
      value: "45 Days",
      description: "Reduced average time to secure first job after graduation",
      icon: "Clock",
      color: "achievement-amber"
    },
    {
      id: 3,
      category: "Network Growth",
      title: "Mentor Satisfaction",
      value: "96.8%",
      description: "Alumni mentors report high satisfaction with mentoring experience",
      icon: "Heart",
      color: "academic-blue"
    },
    {
      id: 4,
      category: "Resource Utilization",
      title: "Study Time Efficiency",
      value: "40%",
      description: "Reduction in study time needed to achieve same learning outcomes",
      icon: "Zap",
      color: "credibility-indigo"
    }
  ];

  const monthlyGrowth = [
    { month: "Jan 2024", students: 45200, resources: 98500, connections: 15200 },
    { month: "Feb 2024", students: 46800, resources: 102300, connections: 15800 },
    { month: "Mar 2024", students: 48100, resources: 107200, connections: 16400 },
    { month: "Apr 2024", students: 49600, resources: 112800, connections: 17100 },
    { month: "May 2024", students: 50900, resources: 118400, connections: 17700 },
    { month: "Jun 2024", students: 52200, resources: 123900, connections: 18300 },
    { month: "Jul 2024", students: 52847, resources: 125630, connections: 18945 }
  ];

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        studentsHelped: Math.floor(finalStats?.studentsHelped * progress),
        resourcesShared: Math.floor(finalStats?.resourcesShared * progress),
        mentorConnections: Math.floor(finalStats?.mentorConnections * progress),
        placementRate: Math.floor(finalStats?.placementRate * progress * 10) / 10,
        universitiesPartnered: Math.floor(finalStats?.universitiesPartnered * progress),
        averageImprovement: Math.floor(finalStats?.averageImprovement * progress * 10) / 10
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(finalStats);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-academic-blue via-credibility-indigo to-accent text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 border border-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 border border-white rounded-full animate-pulse delay-500"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Icon name="BarChart3" size={20} color="white" />
            <span className="text-sm font-inter font-medium">Real-Time Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold mb-6">
            Measuring Our Success
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto font-inter leading-relaxed">
            Every number tells a story of transformation, growth, and success. Here's how LinkeMate is making a difference in students' lives across India.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center knowledge-card">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="Users" size={32} color="white" />
            </div>
            <div className="text-4xl sm:text-5xl font-poppins font-bold mb-3 text-achievement-amber">
              {animatedStats?.studentsHelped?.toLocaleString()}
            </div>
            <div className="text-lg font-inter font-medium mb-2">Students Helped</div>
            <div className="text-sm opacity-80 font-inter">
              Across {animatedStats?.universitiesPartnered}+ universities
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center knowledge-card">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="BookOpen" size={32} color="white" />
            </div>
            <div className="text-4xl sm:text-5xl font-poppins font-bold mb-3 text-progress-emerald">
              {animatedStats?.resourcesShared?.toLocaleString()}
            </div>
            <div className="text-lg font-inter font-medium mb-2">Resources Shared</div>
            <div className="text-sm opacity-80 font-inter">
              Notes, guides, and study materials
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center knowledge-card">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="UserCheck" size={32} color="white" />
            </div>
            <div className="text-4xl sm:text-5xl font-poppins font-bold mb-3 text-white">
              {animatedStats?.mentorConnections?.toLocaleString()}
            </div>
            <div className="text-lg font-inter font-medium mb-2">Mentor Connections</div>
            <div className="text-sm opacity-80 font-inter">
              Meaningful student-alumni relationships
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center knowledge-card">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="Target" size={32} color="white" />
            </div>
            <div className="text-4xl sm:text-5xl font-poppins font-bold mb-3 text-achievement-amber">
              {animatedStats?.placementRate}%
            </div>
            <div className="text-lg font-inter font-medium mb-2">Placement Success Rate</div>
            <div className="text-sm opacity-80 font-inter">
              Above industry average of 78%
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center knowledge-card">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="Building2" size={32} color="white" />
            </div>
            <div className="text-4xl sm:text-5xl font-poppins font-bold mb-3 text-progress-emerald">
              {animatedStats?.universitiesPartnered}
            </div>
            <div className="text-lg font-inter font-medium mb-2">University Partners</div>
            <div className="text-sm opacity-80 font-inter">
              IITs, NITs, and top private colleges
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center knowledge-card">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="TrendingUp" size={32} color="white" />
            </div>
            <div className="text-4xl sm:text-5xl font-poppins font-bold mb-3 text-white">
              {animatedStats?.averageImprovement}%
            </div>
            <div className="text-lg font-inter font-medium mb-2">Academic Improvement</div>
            <div className="text-sm opacity-80 font-inter">
              Average grade improvement rate
            </div>
          </div>
        </div>

        {/* Impact Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {impactStories?.map((story) => (
            <div key={story?.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 knowledge-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 bg-${story?.color}/20 rounded-lg flex items-center justify-center`}>
                  <Icon name={story?.icon} size={20} color="white" />
                </div>
                <div className="text-xs font-inter opacity-80">{story?.category}</div>
              </div>
              <div className="text-2xl font-poppins font-bold mb-2">{story?.value}</div>
              <div className="text-sm font-inter font-medium mb-2">{story?.title}</div>
              <div className="text-xs opacity-80 font-inter leading-relaxed">{story?.description}</div>
            </div>
          ))}
        </div>

        {/* Growth Timeline */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-poppins font-bold mb-3">Growth Timeline (2024)</h3>
            <p className="text-sm opacity-80 font-inter">Our journey of continuous growth and impact</p>
          </div>
          
          <div className="overflow-x-auto">
            <div className="flex space-x-6 min-w-max pb-4">
              {monthlyGrowth?.map((data, index) => (
                <div key={index} className="flex-shrink-0 w-32 text-center">
                  <div className="bg-white/20 rounded-2xl p-4 mb-3">
                    <div className="text-lg font-poppins font-bold text-achievement-amber mb-1">
                      {(data?.students / 1000)?.toFixed(0)}K
                    </div>
                    <div className="text-xs opacity-80 mb-2">Students</div>
                    <div className="text-sm font-inter font-medium text-progress-emerald mb-1">
                      {(data?.resources / 1000)?.toFixed(0)}K
                    </div>
                    <div className="text-xs opacity-80 mb-2">Resources</div>
                    <div className="text-sm font-inter font-medium text-white">
                      {(data?.connections / 1000)?.toFixed(1)}K
                    </div>
                    <div className="text-xs opacity-80">Connections</div>
                  </div>
                  <div className="text-xs font-inter opacity-80">{data?.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12">
            <Icon name="Rocket" size={48} color="white" className="mx-auto mb-6 opacity-80" />
            <h3 className="text-3xl font-poppins font-bold mb-4">Be Part of Our Success Story</h3>
            <p className="text-lg font-inter opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of students and alumni who are already transforming their academic and professional journeys through LinkeMate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-achievement-amber hover:bg-amber-600 text-white px-8 py-4 rounded-2xl font-inter font-semibold transition-all duration-300 shadow-brand-md hover:shadow-brand-lg">
                Join as Student
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-inter font-semibold transition-all duration-300 border border-white/30">
                Become a Mentor
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;