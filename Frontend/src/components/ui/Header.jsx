import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';

// --- 1. Define Role Permissions ---
const roleFeatures = {
  admin: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Community', 'Events', 'Announcement', 'Profile', 'Explore', 'Chat'],
  student: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Community', 'Events', 'Announcement', 'Profile', 'Explore', 'Chat'],
  alumni: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Community', 'Events', 'Profile', 'Explore', 'Chat', 'Announcement'],
  teacher: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Events', 'Announcement', 'Profile', 'Explore', 'Chat'],
};
// --- End Role Permissions ---

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null); // Ref for clicking outside to close

  const allNavigationItems = [
    { name: 'Home', path: '/homepage', icon: 'Home' },
    { name: 'Feed', path: '/feed', icon: 'Newspaper' },
    { name: 'Resources Hub', path: '/resources-hub', icon: 'BookOpen' },
    { name: 'Explore', path: '/explore', icon: 'Compass' },
    { name: 'Community', path: '/community', icon: 'Users' },
    { name: 'Announcement', path: '/announcements', icon: 'Megaphone' },
    { name: 'Events', path: '/events', icon: 'Calendar' },
    { name: 'Chat', path: '/chatPage', icon: 'MessageSquare' },
    { name: 'Profile', path: '/profile', icon: 'User' },
    { name: 'About CampusPull', path: '/about-link-mate', icon: 'Info' },
  ];

  // --- 2. Filter Navigation Based on Role ---
  const allowedFeatures = roleFeatures[user?.role] || [];
  const authorizedItems = allNavigationItems.filter(item =>
    allowedFeatures.includes(item.name)
  );

  // --- 3. Split Items: Main Bar vs Hamburger Menu ---
  // Items designated for the Hamburger Menu
  const hamburgerItemNames = ['Profile', 'About CampusPull'];

  // Left side: Everything authorized EXCEPT the hamburger items
  const mainNavItems = authorizedItems.filter(item => !hamburgerItemNames.includes(item.name));

  // Right side (Menu): Only the authorized hamburger items
  const menuNavItems = authorizedItems.filter(item => hamburgerItemNames.includes(item.name));

  const isActivePath = (path) => location?.pathname === path;
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-brand-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/homepage" className="flex items-center space-x-3 group">
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

          {/* Desktop Navigation (Main Links Only) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-inter font-medium transition-all duration-300 ${
                  isActivePath(item.path)
                    ? 'bg-academic-blue text-white shadow-brand-sm'
                    : 'text-wisdom-charcoal hover:bg-surface hover:text-academic-blue'
                }`}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  color={isActivePath(item.path) ? 'white' : 'currentColor'}
                />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Hamburger Button (Visible on ALL screens now) */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-wisdom-charcoal hover:text-academic-blue ml-2"
            >
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
            </Button>

            {/* Dropdown Menu (Contains Profile, About, Logout) */}
            {isMenuOpen && (
              <div className="absolute top-12 right-0 w-64 bg-white border border-slate-200 rounded-xl shadow-brand-lg overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Mobile-only: Main items list (In case screen is small and they aren't on top bar) */}
                <div className="lg:hidden border-b border-slate-100 pb-2 mb-2">
                   {mainNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm font-inter font-medium transition-colors ${
                        isActivePath(item.path)
                          ? 'bg-blue-50 text-academic-blue'
                          : 'text-wisdom-charcoal hover:bg-slate-50'
                      }`}
                    >
                      <Icon name={item.icon} size={18} />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>

                {/* The Requested "Hamburger Only" Items */}
                {menuNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm font-inter font-medium transition-colors ${
                      isActivePath(item.path)
                        ? 'bg-blue-50 text-academic-blue'
                        : 'text-wisdom-charcoal hover:bg-slate-50'
                    }`}
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.name}</span>
                  </Link>
                ))}

                <div className="h-px bg-slate-100 my-1 mx-4"></div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-inter font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Icon name="LogOut" size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;