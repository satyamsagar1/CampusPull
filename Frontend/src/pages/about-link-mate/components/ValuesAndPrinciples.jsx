import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ValuesAndPrinciples = () => {
  const [selectedPrinciple, setSelectedPrinciple] = useState(0);

  const coreValues = [
    {
      id: 1,
      title: "Student-First Philosophy",
      subtitle: "Every Decision Centers Around Student Success",
      description: "We believe that students are at the heart of everything we do. Every feature, policy, and partnership decision is evaluated through the lens of student benefit and success.",
      icon: "Users",
      color: "academic-blue",
      examples: [
        "Free access to all core features for students",
        "24/7 student support and guidance",
        "Student feedback drives product development",
        "Transparent communication about platform changes"
      ],
      impact: "95% student satisfaction rate with platform decisions"
    },
    {
      id: 2,
      title: "Quality Over Quantity",
      subtitle: "Meaningful Connections, Not Just Numbers",
      description: "We focus on creating meaningful, high-quality connections and resources rather than simply maximizing user numbers or content volume.",
      icon: "Award",
      color: "achievement-amber",
      examples: [
        "Curated mentor matching based on compatibility",
        "Peer-reviewed and verified study resources",
        "Quality-focused alumni recruitment process",
        "Regular content audits and improvements"
      ],
      impact: "87% of mentor-student matches result in ongoing relationships"
    },
    {
      id: 3,
      title: "Transparency & Trust",
      subtitle: "Open Communication Builds Strong Communities",
      description: "We maintain complete transparency in our operations, data usage, and decision-making processes to build lasting trust with our community.",
      icon: "Shield",
      color: "progress-emerald",
      examples: [
        "Open-source privacy policy in simple language",
        "Regular community updates and roadmap sharing",
        "Clear data usage and protection policies",
        "Transparent mentor verification process"
      ],
      impact: "96% trust rating from community members"
    },
    {
      id: 4,
      title: "Continuous Innovation",
      subtitle: "Always Evolving to Serve Better",
      description: "We embrace change and continuously innovate to stay ahead of educational trends and student needs, ensuring our platform remains relevant and valuable.",
      icon: "Lightbulb",
      color: "credibility-indigo",
      examples: [
        "Monthly feature updates based on user feedback",
        "AI-powered personalization improvements",
        "Integration with emerging educational technologies",
        "Proactive adaptation to industry changes"
      ],
      impact: "New features adopted by 80%+ of users within 30 days"
    },
    {
      id: 5,
      title: "Inclusive Accessibility",
      subtitle: "Education Should Be Available to Everyone",
      description: "We are committed to making quality education and mentorship accessible to students from all backgrounds, regardless of their economic or social circumstances.",
      icon: "Heart",
      color: "action-crimson",
      examples: [
        "Scholarship programs for underprivileged students",
        "Multi-language support for diverse communities",
        "Accessibility features for differently-abled users",
        "Partnerships with rural and tier-2/3 colleges"
      ],
      impact: "40% of our users come from tier-2 and tier-3 cities"
    },
    {
      id: 6,
      title: "Data Privacy & Security",
      subtitle: "Your Information is Sacred to Us",
      description: "We implement the highest standards of data protection and privacy, ensuring that student and alumni information is secure and used only for their benefit.",
      icon: "Lock",
      color: "insight-gray",
      examples: [
        "End-to-end encryption for all communications",
        "Minimal data collection with explicit consent",
        "Regular security audits and updates",
        "User control over data sharing preferences"
      ],
      impact: "Zero data breaches since platform launch"
    }
  ];

  const ethicalCommitments = [
    {
      title: "No Exploitation",
      description: "We never exploit student desperation or financial constraints for profit",
      icon: "ShieldCheck"
    },
    {
      title: "Authentic Connections",
      description: "All mentor profiles are verified and connections are based on genuine compatibility",
      icon: "UserCheck"
    },
    {
      title: "Fair Opportunity",
      description: "Equal access to opportunities regardless of background or university tier",
      icon: "Scale"
    },
    {
      title: "Mental Health Support",
      description: "Resources and support for student mental health and well-being",
      icon: "Heart"
    }
  ];

  return (
    <section className="py-20 bg-knowledge-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-progress-emerald/10 rounded-full px-6 py-3 mb-6">
            <Icon name="Compass" size={20} color="var(--color-progress-emerald)" />
            <span className="text-sm font-inter font-medium text-progress-emerald">Our Foundation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-wisdom-charcoal mb-6">
            Values & Principles That Guide Us
          </h2>
          <p className="text-xl text-insight-gray max-w-3xl mx-auto font-inter leading-relaxed">
            These core values aren't just words on a page - they're the principles that guide every decision we make and every feature we build at LinkeMate.
          </p>
        </div>

        {/* Values Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {coreValues?.map((value, index) => (
            <button
              key={value?.id}
              onClick={() => setSelectedPrinciple(index)}
              className={`p-4 rounded-2xl transition-all duration-300 text-center ${
                selectedPrinciple === index
                  ? `bg-${value?.color} text-white shadow-brand-md`
                  : 'bg-white text-wisdom-charcoal hover:bg-surface border border-slate-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                selectedPrinciple === index 
                  ? 'bg-white/20' 
                  : `bg-${value?.color}/10`
              }`}>
                <Icon 
                  name={value?.icon} 
                  size={24} 
                  color={selectedPrinciple === index ? 'white' : `var(--color-${value?.color})`} 
                />
              </div>
              <div className={`text-sm font-inter font-medium ${
                selectedPrinciple === index ? 'text-white' : 'text-wisdom-charcoal'
              }`}>
                {value?.title?.split(' ')?.[0]}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Value Details */}
        <div className="bg-white rounded-3xl shadow-brand-lg overflow-hidden mb-16">
          <div className="grid lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className={`w-16 h-16 bg-${coreValues?.[selectedPrinciple]?.color}/10 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon 
                    name={coreValues?.[selectedPrinciple]?.icon} 
                    size={32} 
                    color={`var(--color-${coreValues?.[selectedPrinciple]?.color})`} 
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-poppins font-bold text-wisdom-charcoal mb-2">
                    {coreValues?.[selectedPrinciple]?.title}
                  </h3>
                  <p className={`text-${coreValues?.[selectedPrinciple]?.color} font-inter font-semibold`}>
                    {coreValues?.[selectedPrinciple]?.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-lg text-wisdom-charcoal font-inter leading-relaxed mb-8">
                {coreValues?.[selectedPrinciple]?.description}
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-poppins font-semibold text-wisdom-charcoal mb-4">
                    How We Practice This
                  </h4>
                  <div className="space-y-3">
                    {coreValues?.[selectedPrinciple]?.examples?.map((example, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-progress-emerald/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon name="Check" size={12} color="var(--color-progress-emerald)" />
                        </div>
                        <span className="text-wisdom-charcoal font-inter">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`bg-${coreValues?.[selectedPrinciple]?.color}/5 rounded-2xl p-6 border-l-4 border-${coreValues?.[selectedPrinciple]?.color}`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon name="TrendingUp" size={20} color={`var(--color-${coreValues?.[selectedPrinciple]?.color})`} />
                    <span className="font-poppins font-semibold text-wisdom-charcoal">Measurable Impact</span>
                  </div>
                  <p className={`text-${coreValues?.[selectedPrinciple]?.color} font-inter font-semibold`}>
                    {coreValues?.[selectedPrinciple]?.impact}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Representation */}
            <div className={`bg-gradient-to-br from-${coreValues?.[selectedPrinciple]?.color} to-${coreValues?.[selectedPrinciple]?.color} p-8 lg:p-12 text-white relative overflow-hidden`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 border border-white rounded-full"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 border border-white rounded-full"></div>
              </div>

              <div className="relative">
                <h4 className="text-2xl font-poppins font-bold mb-6">In Practice</h4>
                
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon name="Users" size={24} color="white" />
                      <span className="font-inter font-semibold">Community Impact</span>
                    </div>
                    <p className="text-sm font-inter opacity-90 leading-relaxed">
                      This principle directly influences how we interact with our community of 50K+ students and 2.5K+ alumni mentors.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon name="Code" size={24} color="white" />
                      <span className="font-inter font-semibold">Product Development</span>
                    </div>
                    <p className="text-sm font-inter opacity-90 leading-relaxed">
                      Every feature and update is evaluated against this core value before implementation.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon name="Handshake" size={24} color="white" />
                      <span className="font-inter font-semibold">Partnership Decisions</span>
                    </div>
                    <p className="text-sm font-inter opacity-90 leading-relaxed">
                      We only partner with organizations that align with and support this principle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ethical Commitments */}
        <div className="bg-gradient-to-br from-academic-blue to-credibility-indigo rounded-3xl p-8 lg:p-12 text-white mb-16">
          <div className="text-center mb-12">
            <Icon name="Scale" size={48} color="white" className="mx-auto mb-6 opacity-80" />
            <h3 className="text-3xl font-poppins font-bold mb-4">Our Ethical Commitments</h3>
            <p className="text-lg font-inter opacity-90 max-w-2xl mx-auto">
              Beyond our core values, we make specific ethical commitments to ensure we always act in the best interest of our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ethicalCommitments?.map((commitment, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center knowledge-card">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={commitment?.icon} size={24} color="white" />
                </div>
                <h4 className="text-lg font-poppins font-semibold mb-3">{commitment?.title}</h4>
                <p className="text-sm font-inter opacity-90 leading-relaxed">{commitment?.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Testimonials */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-brand-lg">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-poppins font-bold text-wisdom-charcoal mb-4">
              What Our Community Says
            </h3>
            <p className="text-lg text-insight-gray max-w-2xl mx-auto font-inter">
              Our values aren't just internal guidelines - they're reflected in the experiences of our community members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "LinkeMate's commitment to student-first approach is evident in every interaction. They genuinely care about our success.",
                author: "Priya Sharma",
                role: "Computer Science Student, IIT Delhi",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
              },
              {
                quote: "The quality of mentors and resources on LinkeMate is exceptional. It's clear they prioritize quality over quantity.",
                author: "Rahul Patel",
                role: "Mechanical Engineering Student, NIT Trichy",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              },
              {
                quote: "I appreciate LinkeMate's transparency in how they handle our data and make platform decisions. Trust is everything.",
                author: "Sneha Reddy",
                role: "Alumni Mentor, Software Engineer at Google",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
              }
            ]?.map((testimonial, index) => (
              <div key={index} className="bg-surface rounded-2xl p-6">
                <Icon name="Quote" size={24} color="var(--color-academic-blue)" className="mb-4 opacity-60" />
                <p className="text-wisdom-charcoal font-inter leading-relaxed mb-6 italic">
                  "{testimonial?.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={testimonial?.avatar} 
                      alt={testimonial?.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-poppins font-semibold text-wisdom-charcoal">
                      {testimonial?.author}
                    </div>
                    <div className="text-sm text-insight-gray font-inter">
                      {testimonial?.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-progress-emerald to-academic-blue rounded-3xl p-12 text-white">
            <Icon name="Compass" size={48} color="white" className="mx-auto mb-6 opacity-80" />
            <h3 className="text-3xl font-poppins font-bold mb-4">Join Our Value-Driven Community</h3>
            <p className="text-lg font-inter opacity-90 mb-8 max-w-2xl mx-auto">
              Be part of a platform that puts your success first and operates with integrity, transparency, and genuine care for your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-achievement-amber hover:bg-amber-600 text-white px-8 py-4 rounded-2xl font-inter font-semibold transition-all duration-300 shadow-brand-md hover:shadow-brand-lg">
                Experience Our Values
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

export default ValuesAndPrinciples;