import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PlatformEvolution = () => {
  const [selectedMilestone, setSelectedMilestone] = useState(0);

  const milestones = [
    {
      id: 1,
      year: "2020",
      quarter: "Q3",
      title: "The Idea is Born",
      description: "Founded by two passionate students who experienced firsthand the challenges of navigating university life without proper guidance.",
      achievements: [
        "Initial concept development",
        "Market research with 500+ students",
        "First prototype development",
        "Seed funding secured"
      ],
      metrics: {
        users: 0,
        resources: 0,
        universities: 0
      },
      icon: "Lightbulb",
      color: "achievement-amber"
    },
    {
      id: 2,
      year: "2021",
      quarter: "Q1",
      title: "MVP Launch",
      description: "Launched our minimum viable product with basic resource sharing and mentor connection features for IIT Delhi students.",
      achievements: [
        "First 100 student registrations",
        "Partnership with IIT Delhi",
        "Basic resource library created",
        "Alumni mentor onboarding"
      ],
      metrics: {
        users: 250,
        resources: 150,
        universities: 1
      },
      icon: "Rocket",
      color: "academic-blue"
    },
    {
      id: 3,
      year: "2021",
      quarter: "Q4",
      title: "Multi-University Expansion",
      description: "Expanded to 5 premier institutions including IITs and NITs, introducing advanced matching algorithms for mentor-student connections.",
      achievements: [
        "5 university partnerships",
        "Advanced matching algorithm",
        "Mobile app beta launch",
        "First placement success stories"
      ],
      metrics: {
        users: 2500,
        resources: 1200,
        universities: 5
      },
      icon: "Building2",
      color: "progress-emerald"
    },
    {
      id: 4,
      year: "2022",
      quarter: "Q2",
      title: "AI-Powered Features",
      description: "Introduced AI-powered resource recommendations and smart study plans, revolutionizing personalized learning experiences.",
      achievements: [
        "AI recommendation engine",
        "Smart study plans",
        "Interactive career roadmaps",
        "Community forums launch"
      ],
      metrics: {
        users: 8500,
        resources: 5800,
        universities: 15
      },
      icon: "Brain",
      color: "credibility-indigo"
    },
    {
      id: 5,
      year: "2023",
      quarter: "Q1",
      title: "National Recognition",
      description: "Achieved national recognition with awards and expanded to 50+ universities across India, serving diverse student communities.",
      achievements: [
        "50+ university partnerships",
        "National education award",
        "Series A funding round",
        "Advanced analytics dashboard"
      ],
      metrics: {
        users: 25000,
        resources: 18500,
        universities: 52
      },
      icon: "Award",
      color: "achievement-amber"
    },
    {
      id: 6,
      year: "2023",
      quarter: "Q4",
      title: "Platform Maturity",
      description: "Reached platform maturity with comprehensive features, enterprise partnerships, and proven impact on student success rates.",
      achievements: [
        "100+ university partnerships",
        "Enterprise partnerships",
        "Advanced mentorship programs",
        "International expansion planning"
      ],
      metrics: {
        users: 45000,
        resources: 85000,
        universities: 105
      },
      icon: "Target",
      color: "progress-emerald"
    },
    {
      id: 7,
      year: "2024",
      quarter: "Q3",
      title: "Current Milestone",
      description: "Today, LinkeMate serves 50K+ students across 127+ universities, with a comprehensive ecosystem of resources, mentors, and opportunities.",
      achievements: [
        "50K+ active students",
        "125K+ resources shared",
        "18K+ mentor connections",
        "94.7% placement success rate"
      ],
      metrics: {
        users: 52847,
        resources: 125630,
        universities: 127
      },
      icon: "Sparkles",
      color: "academic-blue"
    }
  ];

  const upcomingFeatures = [
    {
      title: "Global Expansion",
      description: "Expanding to international universities and creating cross-border mentorship opportunities",
      timeline: "Q4 2024",
      icon: "Globe"
    },
    {
      title: "VR Study Rooms",
      description: "Virtual reality study environments for immersive collaborative learning experiences",
      timeline: "Q1 2025",
      icon: "Headphones"
    },
    {
      title: "Blockchain Credentials",
      description: "Blockchain-verified skill certificates and achievement tracking system",
      timeline: "Q2 2025",
      icon: "Shield"
    },
    {
      title: "AI Career Coach",
      description: "Advanced AI-powered career coaching with personalized guidance and industry insights",
      timeline: "Q3 2025",
      icon: "Bot"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-surface via-knowledge-white to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-academic-blue/10 rounded-full px-6 py-3 mb-6">
            <Icon name="Timeline" size={20} color="var(--color-academic-blue)" />
            <span className="text-sm font-inter font-medium text-academic-blue">Our Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-wisdom-charcoal mb-6">
            Platform Evolution Timeline
          </h2>
          <p className="text-xl text-insight-gray max-w-3xl mx-auto font-inter leading-relaxed">
            From a simple idea to a comprehensive educational ecosystem - discover how LinkeMate has grown and evolved to serve students better.
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {milestones?.map((milestone, index) => (
            <button
              key={milestone?.id}
              onClick={() => setSelectedMilestone(index)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                selectedMilestone === index
                  ? 'bg-academic-blue text-white shadow-brand-md'
                  : 'bg-white text-wisdom-charcoal hover:bg-academic-blue/10 border border-slate-200'
              }`}
            >
              <Icon 
                name={milestone?.icon} 
                size={16} 
                color={selectedMilestone === index ? 'white' : 'var(--color-academic-blue)'} 
              />
              <span className="text-sm font-inter font-medium">
                {milestone?.year} {milestone?.quarter}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Milestone Details */}
        <div className="bg-white rounded-3xl shadow-brand-lg overflow-hidden mb-16">
          <div className="grid lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 bg-${milestones?.[selectedMilestone]?.color}/10 rounded-2xl flex items-center justify-center`}>
                  <Icon 
                    name={milestones?.[selectedMilestone]?.icon} 
                    size={32} 
                    color={`var(--color-${milestones?.[selectedMilestone]?.color})`} 
                  />
                </div>
                <div>
                  <div className="text-sm text-insight-gray font-inter mb-1">
                    {milestones?.[selectedMilestone]?.year} {milestones?.[selectedMilestone]?.quarter}
                  </div>
                  <h3 className="text-2xl font-poppins font-bold text-wisdom-charcoal">
                    {milestones?.[selectedMilestone]?.title}
                  </h3>
                </div>
              </div>

              <p className="text-lg text-wisdom-charcoal font-inter leading-relaxed mb-8">
                {milestones?.[selectedMilestone]?.description}
              </p>

              <div className="space-y-4">
                <h4 className="text-lg font-poppins font-semibold text-wisdom-charcoal">
                  Key Achievements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {milestones?.[selectedMilestone]?.achievements?.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-progress-emerald/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={12} color="var(--color-progress-emerald)" />
                      </div>
                      <span className="text-wisdom-charcoal font-inter text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-gradient-to-br from-academic-blue to-credibility-indigo p-8 lg:p-12 text-white">
              <h4 className="text-2xl font-poppins font-bold mb-8">Platform Metrics</h4>
              
              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-4xl font-poppins font-bold text-achievement-amber mb-2">
                    {milestones?.[selectedMilestone]?.metrics?.users?.toLocaleString()}
                  </div>
                  <div className="text-sm font-inter opacity-90">Active Users</div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-poppins font-bold text-progress-emerald mb-2">
                    {milestones?.[selectedMilestone]?.metrics?.resources?.toLocaleString()}
                  </div>
                  <div className="text-sm font-inter opacity-90">Resources Shared</div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-poppins font-bold text-white mb-2">
                    {milestones?.[selectedMilestone]?.metrics?.universities}
                  </div>
                  <div className="text-sm font-inter opacity-90">Partner Universities</div>
                </div>
              </div>

              {/* Progress Visualization */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="text-sm font-inter opacity-90 mb-3">Growth Progress</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Users</span>
                      <span>{Math.round((milestones?.[selectedMilestone]?.metrics?.users / 52847) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-achievement-amber h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(milestones?.[selectedMilestone]?.metrics?.users / 52847) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Resources</span>
                      <span>{Math.round((milestones?.[selectedMilestone]?.metrics?.resources / 125630) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-progress-emerald h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(milestones?.[selectedMilestone]?.metrics?.resources / 125630) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Universities</span>
                      <span>{Math.round((milestones?.[selectedMilestone]?.metrics?.universities / 127) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(milestones?.[selectedMilestone]?.metrics?.universities / 127) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-brand-lg">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-credibility-indigo/10 rounded-full px-6 py-3 mb-6">
              <Icon name="Telescope" size={20} color="var(--color-credibility-indigo)" />
              <span className="text-sm font-inter font-medium text-credibility-indigo">What's Next</span>
            </div>
            <h3 className="text-3xl font-poppins font-bold text-wisdom-charcoal mb-4">
              Upcoming Features & Roadmap
            </h3>
            <p className="text-lg text-insight-gray max-w-2xl mx-auto font-inter">
              We're constantly innovating to bring you cutting-edge features that will revolutionize your learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingFeatures?.map((feature, index) => (
              <div key={index} className="bg-surface rounded-2xl p-6 knowledge-card">
                <div className="w-12 h-12 bg-academic-blue/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={feature?.icon} size={24} color="var(--color-academic-blue)" />
                </div>
                <h4 className="text-lg font-poppins font-semibold text-wisdom-charcoal mb-3">
                  {feature?.title}
                </h4>
                <p className="text-sm text-insight-gray font-inter leading-relaxed mb-4">
                  {feature?.description}
                </p>
                <div className="flex items-center space-x-2 text-academic-blue">
                  <Icon name="Calendar" size={14} />
                  <span className="text-xs font-inter font-medium">{feature?.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-academic-blue to-credibility-indigo rounded-3xl p-12 text-white">
            <Icon name="Users" size={48} color="white" className="mx-auto mb-6 opacity-80" />
            <h3 className="text-3xl font-poppins font-bold mb-4">Be Part of Our Continued Growth</h3>
            <p className="text-lg font-inter opacity-90 mb-8 max-w-2xl mx-auto">
              Join our community and help shape the future of educational networking. Your success story could be the next milestone in our journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-achievement-amber hover:bg-amber-600 text-white px-8 py-4 rounded-2xl font-inter font-semibold transition-all duration-300 shadow-brand-md hover:shadow-brand-lg">
                Join Our Community
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-inter font-semibold transition-all duration-300 border border-white/30">
                Share Your Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformEvolution;