import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../context/AuthContext'; // Make sure this path is correct

// --- 1. Define Role Permissions ---
const roleFeatures = {
  admin: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Community', 'Events','Announcement', 'Profile', 'Explore', 'Chat', 'Announcement'], // Added Announcement for Admin
  student: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Community', 'Events','Announcement', 'Profile', 'Explore', 'Chat', 'Announcement'], // Added Announcement for Student
  alumni: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Community', 'Events', 'Profile', 'Explore', 'Chat', 'Announcement'], // Added Announcement for Alumni
  teacher: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Events','Announcement', 'Profile', 'Explore', 'Chat', 'Announcement'], // Added Announcement for Teacher
};
// --- End Role Permissions ---

const Header = () => {
  // --- 2. Get User from Context ---
  const { user, logout } = useAuth();
  // --- End Get User ---

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const allNavigationItems = [
    { name: 'Home', path: '/homepage', icon: 'Home' },
    { name: 'Feed', path: '/feed', icon: 'Newspaper' },
    { name: 'Resources Hub', path: '/resources-hub', icon: 'BookOpen' },
    { name: 'About CampusPull', path: '/about-link-mate', icon: 'Info' },
    { name: 'Community', path: '/community', icon: 'Users' },
    { name: 'Announcement', path: '/announcements', icon: 'Megaphone' },
    { name: 'Events', path: '/events', icon: 'Calendar' },
    { name: 'Profile', path: '/profile', icon: 'User' },
    { name: 'Explore', path: '/explore', icon: 'Compass' }, // Assuming Explore is Connections/Networking
    { name: 'Chat', path: '/chatPage', icon: 'MessageSquare' },
    // You might need an 'Announcement' item if you have a dedicated page
    // { name: 'Announcement', path: '/announcements', icon: 'Megaphone' },
  ];

  // --- 3. Filter Navigation Based on Role ---
  const allowedFeatures = roleFeatures[user?.role] || []; // Get features for user's role, default to empty
  const navigationItems = allNavigationItems.filter(item =>
    allowedFeatures.includes(item.name)
  );
  // --- End Filter Navigation ---

  const isActivePath = (path) => location?.pathname === path;
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-brand-sm">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/homepage" className="flex items-center space-x-3 group">
              {/* ... Logo SVG/Icon ... */}
               <div className="relative">
                 <div className="w-10 h-10 bg-gradient-to-br from-academic-blue to-credibility-indigo rounded-lg flex items-center justify-center shadow-brand-sm group-hover:shadow-brand-md transition-all duration-300">
                   <Icon name="GraduationCap" size={24} color="white" />
                 </div>
                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-achievement-amber rounded-full flex items-center justify-center">
                   <Icon name="Sparkles" size={10} color="white" />
                 </div>
               </div>
              <div className="hidden sm:block">
                 <h1 className="text-xl font-poppins font-bold text-wisdom-charcoal group-hover:text-academic-blue transition-colors duration-300">
                   CampusPull
                 </h1>
                 <p className="text-xs text-insight-gray font-inter">Knowledge Without Boundaries</p>
               </div>
            </Link>
          </div>

          {/* Desktop Navigation (Uses filtered 'navigationItems') */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => ( // Uses the filtered list
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-inter font-medium transition-all duration-300 ${
                  isActivePath(item?.path)
                    ? 'bg-academic-blue text-white shadow-brand-sm'
                    : 'text-wisdom-charcoal hover:bg-surface hover:text-academic-blue'
                }`}
              >
                <Icon
                  name={item?.icon}
                  size={18}
                  color={isActivePath(item?.path) ? 'white' : 'currentColor'}
                />
                <span>{item?.name}</span>
              </Link>
            ))}
            {/* Desktop Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-inter font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-300"
            >
              <Icon name="LogOut" size={18} />
              <span>Logout</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-wisdom-charcoal hover:text-academic-blue"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu (Uses filtered 'navigationItems') */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 shadow-brand-md">
            <div className="px-4 py-3 space-y-2">
              {navigationItems?.map((item) => ( // Uses the filtered list
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-inter font-medium transition-all duration-300 ${
                    isActivePath(item?.path)
                      ? 'bg-academic-blue text-white shadow-brand-sm'
                      : 'text-wisdom-charcoal hover:bg-surface hover:text-academic-blue'
                  }`}
                >
                  <Icon
                    name={item?.icon}
                    size={20}
                    color={isActivePath(item?.path) ? 'white' : 'currentColor'}
                  />
                  <span>{item?.name}</span>
                </Link>
              ))}
              {/* Mobile Logout Button */}
              <button
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-inter font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-300 w-full"
              >
                <Icon name="LogOut" size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;