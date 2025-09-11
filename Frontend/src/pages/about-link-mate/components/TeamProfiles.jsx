import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TeamProfiles = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: "Arjun Sharma",
      role: "Co-Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      education: "IIT Delhi, Computer Science Engineering",
      experience: "5+ years",
      previousCompanies: ["Google", "Microsoft", "Flipkart"],
      expertise: ["Product Strategy", "Team Leadership", "EdTech Innovation"],
      motivation: `My journey from a struggling student to a tech leader taught me that the right guidance at the right time can change everything. LinkeMate is my way of ensuring every student gets that guidance.`,
      achievements: ["Forbes 30 Under 30", "TechCrunch Disruptor Award", "IIT Delhi Distinguished Alumni"],
      personalInterests: ["Cricket", "Photography", "Mentoring"],
      linkedIn: "https://linkedin.com/in/arjun-sharma",
      twitter: "https://twitter.com/arjunsharma"
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Co-Founder & CTO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      education: "BITS Pilani, Information Technology",
      experience: "4+ years",
      previousCompanies: ["Amazon", "Zomato", "Paytm"],
      expertise: ["Full-Stack Development", "System Architecture", "AI/ML"],
      motivation: `As a first-generation college graduate, I understand the challenges of navigating higher education without proper support. Technology can bridge this gap beautifully.`,
      achievements: ["Women in Tech Leadership Award", "BITS Pilani Excellence Award", "Open Source Contributor"],
      personalInterests: ["Coding", "Traveling", "Classical Music"],
      linkedIn: "https://linkedin.com/in/priya-patel",
      twitter: "https://twitter.com/priyapatel"
    },
    {
      id: 3,
      name: "Rahul Gupta",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      education: "IIT Bombay, Mechanical Engineering",
      experience: "6+ years",
      previousCompanies: ["Uber", "Ola", "Swiggy"],
      expertise: ["Product Management", "User Experience", "Growth Strategy"],
      motivation: `Great products solve real problems. Every feature we build at LinkeMate is designed to make a student's journey easier and more successful.`,
      achievements: ["Product Manager of the Year", "IIT Bombay Alumni Award", "Startup Mentor"],
      personalInterests: ["Football", "Reading", "Cooking"],
      linkedIn: "https://linkedin.com/in/rahul-gupta",
      twitter: "https://twitter.com/rahulgupta"
    },
    {
      id: 4,
      name: "Sneha Reddy",
      role: "Head of Community",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      education: "NIT Warangal, Computer Science",
      experience: "4+ years",
      previousCompanies: ["LinkedIn", "Facebook", "Byju\'s"],
      expertise: ["Community Building", "Content Strategy", "Alumni Relations"],
      motivation: `Communities thrive when people genuinely care about each other's success. I'm passionate about creating spaces where knowledge and opportunities flow freely.`,
      achievements: ["Community Leader Award", "NIT Warangal Distinguished Alumni", "TEDx Speaker"],
      personalInterests: ["Yoga", "Writing", "Social Work"],
      linkedIn: "https://linkedin.com/in/sneha-reddy",
      twitter: "https://twitter.com/snehareddy"
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Head of Engineering",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      education: "IIT Kanpur, Electrical Engineering",
      experience: "7+ years",
      previousCompanies: ["Netflix", "Spotify", "Razorpay"],
      expertise: ["Scalable Systems", "Cloud Architecture", "DevOps"],
      motivation: `Building technology that can scale to help millions of students is both challenging and rewarding. Every line of code we write has the potential to change lives.`,
      achievements: ["Tech Excellence Award", "IIT Kanpur Gold Medalist", "Open Source Maintainer"],
      personalInterests: ["Chess", "Hiking", "Technology Blogging"],
      linkedIn: "https://linkedin.com/in/vikram-singh",
      twitter: "https://twitter.com/vikramsingh"
    },
    {
      id: 6,
      name: "Ananya Krishnan",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      education: "NID Ahmedabad, Interaction Design",
      experience: "5+ years",
      previousCompanies: ["Adobe", "Figma", "Zomato"],
      expertise: ["UI/UX Design", "Design Systems", "User Research"],
      motivation: `Good design is invisible - it just works. I believe in creating experiences that feel intuitive and delightful for every student who uses LinkeMate.`,
      achievements: ["Design Excellence Award", "NID Alumni Recognition", "Design Mentor"],
      personalInterests: ["Sketching", "Interior Design", "Pottery"],
      linkedIn: "https://linkedin.com/in/ananya-krishnan",
      twitter: "https://twitter.com/ananyakrishnan"
    }
  ];

  const coreValues = [
    {
      title: "Student-First Approach",
      description: "Every decision we make prioritizes student success and well-being",
      icon: "Users"
    },
    {
      title: "Quality Over Quantity",
      description: "We focus on meaningful connections and high-quality resources",
      icon: "Award"
    },
    {
      title: "Transparency & Trust",
      description: "Open communication and honest relationships with our community",
      icon: "Shield"
    },
    {
      title: "Continuous Innovation",
      description: "Always improving and adapting to serve our users better",
      icon: "Lightbulb"
    }
  ];

  return (
    <section className="py-20 bg-knowledge-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-credibility-indigo/10 rounded-full px-6 py-3 mb-6">
            <Icon name="Users" size={20} color="var(--color-credibility-indigo)" />
            <span className="text-sm font-inter font-medium text-credibility-indigo">Our Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-wisdom-charcoal mb-6">
            Meet the Minds Behind LinkeMate
          </h2>
          <p className="text-xl text-insight-gray max-w-3xl mx-auto font-inter leading-relaxed">
            A diverse team of passionate individuals united by the mission to democratize access to quality education and mentorship.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {teamMembers?.map((member) => (
            <div
              key={member?.id}
              className="bg-white rounded-3xl p-6 shadow-brand-lg hover:shadow-brand-xl transition-all duration-500 knowledge-card cursor-pointer group"
              onClick={() => setSelectedMember(member)}
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-brand-md group-hover:scale-105 transition-transform duration-300">
                  <Image 
                    src={member?.image} 
                    alt={member?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-academic-blue rounded-full flex items-center justify-center shadow-brand-sm">
                  <Icon name="Sparkles" size={16} color="white" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-poppins font-bold text-wisdom-charcoal mb-2">
                  {member?.name}
                </h3>
                <p className="text-academic-blue font-inter font-semibold mb-3">
                  {member?.role}
                </p>
                <div className="text-sm text-insight-gray font-inter mb-4">
                  {member?.education}
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {member?.expertise?.slice(0, 2)?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-academic-blue/10 text-academic-blue rounded-full text-xs font-inter"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center space-x-3">
                  <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center hover:bg-academic-blue hover:text-white transition-colors duration-300 cursor-pointer">
                    <Icon name="Linkedin" size={16} />
                  </div>
                  <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center hover:bg-academic-blue hover:text-white transition-colors duration-300 cursor-pointer">
                    <Icon name="Twitter" size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className="bg-gradient-to-br from-academic-blue to-credibility-indigo rounded-3xl p-12 text-white mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-poppins font-bold mb-4">Our Core Values</h3>
            <p className="text-lg font-inter opacity-90 max-w-2xl mx-auto">
              These principles guide every decision we make and every feature we build at LinkeMate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues?.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={value?.icon} size={32} color="white" />
                </div>
                <h4 className="text-lg font-poppins font-semibold mb-3">{value?.title}</h4>
                <p className="text-sm font-inter opacity-90 leading-relaxed">{value?.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-4xl font-poppins font-bold text-academic-blue mb-2">6</div>
            <div className="text-insight-gray font-inter">Core Team Members</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-poppins font-bold text-achievement-amber mb-2">25+</div>
            <div className="text-insight-gray font-inter">Years Combined Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-poppins font-bold text-progress-emerald mb-2">15+</div>
            <div className="text-insight-gray font-inter">Top Companies Background</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-poppins font-bold text-credibility-indigo mb-2">100%</div>
            <div className="text-insight-gray font-inter">Commitment to Students</div>
          </div>
        </div>
      </div>
      {/* Team Member Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-start space-x-6">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-brand-lg">
                    <Image 
                      src={selectedMember?.image} 
                      alt={selectedMember?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-3xl font-poppins font-bold text-wisdom-charcoal mb-2">
                      {selectedMember?.name}
                    </h3>
                    <p className="text-xl text-academic-blue font-inter font-semibold mb-3">
                      {selectedMember?.role}
                    </p>
                    <div className="flex items-center space-x-2 text-insight-gray mb-4">
                      <Icon name="GraduationCap" size={16} />
                      <span className="text-sm font-inter">{selectedMember?.education}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-insight-gray">
                      <Icon name="Briefcase" size={16} />
                      <span className="text-sm font-inter">{selectedMember?.experience} experience</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-10 h-10 bg-surface rounded-full flex items-center justify-center hover:bg-academic-blue hover:text-white transition-colors duration-300"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Motivation */}
                  <div>
                    <h4 className="text-lg font-poppins font-semibold text-wisdom-charcoal mb-3">
                      Personal Motivation
                    </h4>
                    <div className="bg-gradient-to-r from-academic-blue/5 to-achievement-amber/5 rounded-2xl p-6 border-l-4 border-academic-blue">
                      <p className="text-wisdom-charcoal font-inter leading-relaxed italic">
                        "{selectedMember?.motivation}"
                      </p>
                    </div>
                  </div>

                  {/* Expertise */}
                  <div>
                    <h4 className="text-lg font-poppins font-semibold text-wisdom-charcoal mb-3">
                      Areas of Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember?.expertise?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-academic-blue/10 text-academic-blue rounded-full text-sm font-inter font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Previous Companies */}
                  <div>
                    <h4 className="text-lg font-poppins font-semibold text-wisdom-charcoal mb-3">
                      Previous Experience
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember?.previousCompanies?.map((company, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-surface text-wisdom-charcoal rounded-full text-sm font-inter"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Achievements */}
                  <div>
                    <h4 className="text-lg font-poppins font-semibold text-wisdom-charcoal mb-3">
                      Key Achievements
                    </h4>
                    <div className="space-y-3">
                      {selectedMember?.achievements?.map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-achievement-amber/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon name="Award" size={12} color="var(--color-achievement-amber)" />
                          </div>
                          <span className="text-wisdom-charcoal font-inter text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personal Interests */}
                  <div>
                    <h4 className="text-lg font-poppins font-semibold text-wisdom-charcoal mb-3">
                      Personal Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember?.personalInterests?.map((interest, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-progress-emerald/10 text-progress-emerald rounded-full text-sm font-inter"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="text-lg font-poppins font-semibold text-wisdom-charcoal mb-3">
                      Connect
                    </h4>
                    <div className="flex space-x-4">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-academic-blue text-white rounded-xl hover:bg-blue-700 transition-colors duration-300">
                        <Icon name="Linkedin" size={16} />
                        <span className="text-sm font-inter">LinkedIn</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-surface text-wisdom-charcoal rounded-xl hover:bg-slate-200 transition-colors duration-300">
                        <Icon name="Twitter" size={16} />
                        <span className="text-sm font-inter">Twitter</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeamProfiles;