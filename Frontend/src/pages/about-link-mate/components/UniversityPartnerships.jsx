import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const UniversityPartnerships = () => {
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  const universities = [
    {
      id: 1,
      name: "Indian Institute of Technology Delhi",
      shortName: "IIT Delhi",
      location: "New Delhi",
      coordinates: { lat: 28.5449, lng: 77.1928 },
      students: 12500,
      alumni: 850,
      placements: 98,
      partnershipYear: 2020,
      testimonial: "LinkeMate has revolutionized how our students connect with alumni. The platform has significantly improved placement rates and student satisfaction.",
      administrator: "Dr. Rajesh Kumar, Dean of Student Affairs",
      programs: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Chemical Engineering"]
    },
    {
      id: 2,
      name: "Birla Institute of Technology and Science",
      shortName: "BITS Pilani",
      location: "Pilani, Rajasthan",
      coordinates: { lat: 28.3639, lng: 75.5857 },
      students: 8200,
      alumni: 620,
      placements: 95,
      partnershipYear: 2021,
      testimonial: "The mentorship connections facilitated through LinkeMate have been invaluable for our students\' career development.",
      administrator: "Prof. Meera Sharma, Director of Placements",
      programs: ["Information Technology", "Electronics", "Biotechnology", "Management"]
    },
    {
      id: 3,
      name: "National Institute of Technology Trichy",
      shortName: "NIT Trichy",
      location: "Tiruchirappalli, Tamil Nadu",
      coordinates: { lat: 10.7590, lng: 78.8147 },
      students: 9800,
      alumni: 720,
      placements: 92,
      partnershipYear: 2021,
      testimonial: "LinkeMate\'s resource sharing platform has enhanced our students\' academic performance and industry readiness.",
      administrator: "Dr. Anand Krishnan, Head of Training & Placements",
      programs: ["Civil Engineering", "Computer Science", "Production Engineering", "Architecture"]
    },
    {
      id: 4,
      name: "Delhi Technological University",
      shortName: "DTU",
      location: "New Delhi",
      coordinates: { lat: 28.7500, lng: 77.1167 },
      students: 7500,
      alumni: 480,
      placements: 89,
      partnershipYear: 2022,
      testimonial: "The alumni network accessibility through LinkeMate has opened new opportunities for our students.",
      administrator: "Dr. Priya Agarwal, Assistant Dean",
      programs: ["Software Engineering", "Electronics", "Mathematics", "Applied Physics"]
    },
    {
      id: 5,
      name: "Vellore Institute of Technology",
      shortName: "VIT Vellore",
      location: "Vellore, Tamil Nadu",
      coordinates: { lat: 12.9692, lng: 79.1559 },
      students: 15000,
      alumni: 950,
      placements: 87,
      partnershipYear: 2022,
      testimonial: "LinkeMate has created a vibrant ecosystem where knowledge flows seamlessly between our current students and successful alumni.",
      administrator: "Prof. Suresh Babu, Director of Career Services",
      programs: ["Computer Science", "Biotechnology", "Mechanical Engineering", "Business Administration"]
    }
  ];

  const totalStats = universities?.reduce((acc, uni) => ({
    students: acc?.students + uni?.students,
    alumni: acc?.alumni + uni?.alumni,
    avgPlacement: Math.round(universities?.reduce((sum, u) => sum + u?.placements, 0) / universities?.length)
  }), { students: 0, alumni: 0, avgPlacement: 0 });

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-progress-emerald/10 rounded-full px-6 py-3 mb-6">
            <Icon name="Building2" size={20} color="var(--color-progress-emerald)" />
            <span className="text-sm font-inter font-medium text-progress-emerald">Partnerships</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-wisdom-charcoal mb-6">
            Trusted by Leading Universities
          </h2>
          <p className="text-xl text-insight-gray max-w-3xl mx-auto font-inter leading-relaxed">
            We partner with top educational institutions across India to create meaningful connections between students and alumni.
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 text-center shadow-brand-md knowledge-card">
            <div className="w-16 h-16 bg-academic-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={32} color="var(--color-academic-blue)" />
            </div>
            <div className="text-4xl font-poppins font-bold text-academic-blue mb-2">
              {(totalStats?.students / 1000)?.toFixed(0)}K+
            </div>
            <div className="text-insight-gray font-inter">Active Students</div>
          </div>
          <div className="bg-white rounded-2xl p-8 text-center shadow-brand-md knowledge-card">
            <div className="w-16 h-16 bg-achievement-amber/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="GraduationCap" size={32} color="var(--color-achievement-amber)" />
            </div>
            <div className="text-4xl font-poppins font-bold text-achievement-amber mb-2">
              {(totalStats?.alumni / 100)?.toFixed(1)}K+
            </div>
            <div className="text-insight-gray font-inter">Alumni Mentors</div>
          </div>
          <div className="bg-white rounded-2xl p-8 text-center shadow-brand-md knowledge-card">
            <div className="w-16 h-16 bg-progress-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="TrendingUp" size={32} color="var(--color-progress-emerald)" />
            </div>
            <div className="text-4xl font-poppins font-bold text-progress-emerald mb-2">
              {totalStats?.avgPlacement}%
            </div>
            <div className="text-insight-gray font-inter">Avg Placement Rate</div>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="bg-white rounded-3xl shadow-brand-lg overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Map */}
            <div className="h-96 lg:h-auto relative">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="University Partnerships Map"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=28.5449,77.1928&z=5&output=embed"
                className="border-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-academic-blue/20 to-transparent pointer-events-none"></div>
            </div>

            {/* University List */}
            <div className="p-8">
              <h3 className="text-2xl font-poppins font-bold text-wisdom-charcoal mb-6">
                Partner Universities
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {universities?.map((university) => (
                  <div
                    key={university?.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedUniversity?.id === university?.id
                        ? 'border-academic-blue bg-academic-blue/5' :'border-slate-200 hover:border-academic-blue/50 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedUniversity(university)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-poppins font-semibold text-wisdom-charcoal mb-1">
                          {university?.shortName}
                        </h4>
                        <p className="text-sm text-insight-gray font-inter mb-2">
                          {university?.location}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-insight-gray">
                          <span>{university?.students?.toLocaleString()} students</span>
                          <span>{university?.alumni} alumni</span>
                          <span>{university?.placements}% placement</span>
                        </div>
                      </div>
                      <div className="text-xs text-academic-blue font-inter font-medium">
                        Since {university?.partnershipYear}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected University Details */}
        {selectedUniversity && (
          <div className="mt-12 bg-white rounded-3xl p-8 shadow-brand-lg">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-3xl font-poppins font-bold text-wisdom-charcoal mb-4">
                  {selectedUniversity?.name}
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Icon name="MapPin" size={20} color="var(--color-insight-gray)" />
                    <span className="text-insight-gray font-inter">{selectedUniversity?.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Calendar" size={20} color="var(--color-insight-gray)" />
                    <span className="text-insight-gray font-inter">
                      Partnership since {selectedUniversity?.partnershipYear}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-academic-blue/5 to-achievement-amber/5 rounded-2xl p-6 border-l-4 border-academic-blue mb-6">
                  <Icon name="Quote" size={24} color="var(--color-academic-blue)" className="mb-3" />
                  <p className="text-wisdom-charcoal font-inter italic leading-relaxed mb-4">
                    "{selectedUniversity?.testimonial}"
                  </p>
                  <p className="text-academic-blue font-inter font-semibold text-sm">
                    - {selectedUniversity?.administrator}
                  </p>
                </div>

                <div>
                  <h4 className="font-poppins font-semibold text-wisdom-charcoal mb-3">
                    Popular Programs
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUniversity?.programs?.map((program, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-academic-blue/10 text-academic-blue rounded-full text-sm font-inter"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface rounded-2xl p-6 text-center">
                    <div className="text-3xl font-poppins font-bold text-academic-blue mb-2">
                      {selectedUniversity?.students?.toLocaleString()}
                    </div>
                    <div className="text-insight-gray font-inter text-sm">Active Students</div>
                  </div>
                  <div className="bg-surface rounded-2xl p-6 text-center">
                    <div className="text-3xl font-poppins font-bold text-achievement-amber mb-2">
                      {selectedUniversity?.alumni}
                    </div>
                    <div className="text-insight-gray font-inter text-sm">Alumni Mentors</div>
                  </div>
                </div>

                <div className="bg-progress-emerald/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-inter font-medium text-wisdom-charcoal">Placement Rate</span>
                    <span className="text-2xl font-poppins font-bold text-progress-emerald">
                      {selectedUniversity?.placements}%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3">
                    <div
                      className="bg-progress-emerald h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${selectedUniversity?.placements}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-academic-blue to-credibility-indigo rounded-2xl p-6 text-white">
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon name="Award" size={24} color="white" />
                    <span className="font-poppins font-semibold">Partnership Impact</span>
                  </div>
                  <p className="font-inter text-sm opacity-90 leading-relaxed">
                    Since partnering with LinkeMate, {selectedUniversity?.shortName} has seen a 
                    {Math.round(Math.random() * 20 + 15)}% increase in student satisfaction and 
                    {Math.round(Math.random() * 15 + 10)}% improvement in placement rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UniversityPartnerships;