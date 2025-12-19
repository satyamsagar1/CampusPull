import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Resources Hub", path: "/resources-hub" },
        { name: "Community Forum", path: "/community" },
        { name: "Events", path: "/events" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Contact Us", path: "/contact" },
        { name: "FAQ", path: "/faq" },
        { name: "Technical Support", path: "/support" },
        { name: "Feedback", path: "/feedback" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Campus-pull", path: "/about-linke-mate" },
        { name: "Our Mission", path: "/mission" },
        { name: "Team", path: "/team" },
        { name: "Careers", path: "/careers" },
        { name: "Press", path: "/press" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
        { name: "Community Guidelines", path: "/guidelines" },
        { name: "Copyright", path: "/copyright" }
      ]
    }
  ];

  const socialLinks = [
    { name: "LinkedIn", icon: "Linkedin", url: "http://linkedin.com/company/campus-pull" },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com/linkemate" },
    { name: "YouTube", icon: "Youtube", url: "https://youtube.com/@campuspull?si=9_l52LtDOq849cXY" },
    { name: "Discord", icon: "MessageSquare", url: "https://discord.gg/linkemate" }
  ];

  const achievements = [
    { label: "Active Students", value: "50,000+" },
    { label: "Alumni Mentors", value: "2,800+" },
    { label: "Universities", value: "150+" },
    { label: "Success Stories", value: "8,900+" }
  ];

  return (
    <footer className="bg-gradient-to-br from-wisdom-charcoal to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Link to="/homepage" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-academic-blue to-credibility-indigo rounded-lg flex items-center justify-center shadow-brand-sm group-hover:shadow-brand-md transition-all duration-300">
                    <Icon name="GraduationCap" size={28} color="white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-achievement-amber rounded-full flex items-center justify-center">
                    <Icon name="Sparkles" size={12} color="white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-poppins font-bold text-white group-hover:text-academic-blue transition-colors duration-300">
                    Campus-pull
                  </h3>
                  <p className="text-sm text-slate-300 font-inter">Knowledge Without Boundaries</p>
                </div>
              </Link>
            </div>
            
            <p className="text-slate-300 font-inter leading-relaxed mb-6 max-w-md">
              Bridging the gap between academic learning and professional success. Connect with mentors, access premium resources, and accelerate your career journey with our vibrant community.
            </p>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {achievements?.map((achievement) => (
                <div key={achievement?.label} className="text-center">
                  <div className="text-xl font-poppins font-bold text-white mb-1">
                    {achievement?.value}
                  </div>
                  <div className="text-xs text-slate-400 font-inter">
                    {achievement?.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.name}
                  href={social?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-academic-blue rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={social?.name}
                >
                  <Icon name={social?.icon} size={18} color="white" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections?.map((section) => (
                <div key={section?.title}>
                  <h4 className="text-lg font-inter font-semibold text-white mb-4">
                    {section?.title}
                  </h4>
                  <ul className="space-y-3">
                    {section?.links?.map((link) => (
                      <li key={link?.name}>
                        <Link
                          to={link?.path}
                          className="text-slate-300 hover:text-white font-inter text-sm transition-colors duration-300 hover:translate-x-1 transform inline-block"
                        >
                          {link?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Newsletter Section */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-inter font-semibold text-white mb-2">
                Stay Updated
              </h4>
              <p className="text-slate-300 font-inter text-sm">
                Get the latest resources, events, and success stories delivered to your inbox.
              </p>
            </div>
            
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-slate-600 rounded-l-lg text-white placeholder-slate-400 font-inter focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-transparent"
              />
              <button className="px-6 py-3 bg-academic-blue hover:bg-blue-700 text-white font-inter font-medium rounded-r-lg transition-all duration-300 shadow-brand-sm hover:shadow-brand-md flex items-center space-x-2">
                <span>Subscribe</span>
                <Icon name="Send" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-slate-400 font-inter">
              <p>© {currentYear} Campus-pull. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <span>Made with</span>
                <Icon name="Heart" size={16} color="#EF4444" />
                <span>for students & alumni</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-slate-400 font-inter">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-progress-emerald rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} color="var(--color-progress-emerald)" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;