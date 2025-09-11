import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchBar = ({ searchQuery, onSearchChange, onFilterToggle, isMobile }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const suggestions = [
    { type: 'recent', text: 'Data Structures and Algorithms', icon: 'Clock' },
    { type: 'recent', text: 'Machine Learning Notes', icon: 'Clock' },
    { type: 'popular', text: 'FAANG Interview Questions', icon: 'TrendingUp' },
    { type: 'popular', text: 'System Design Roadmap', icon: 'TrendingUp' },
    { type: 'suggestion', text: 'Operating Systems', icon: 'Search' },
    { type: 'suggestion', text: 'Database Management', icon: 'Search' },
    { type: 'suggestion', text: 'Computer Networks', icon: 'Search' },
    { type: 'suggestion', text: 'Software Engineering', icon: 'Search' }
  ];

  const filteredSuggestions = suggestions?.filter(suggestion =>
    suggestion?.text?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef?.current && !inputRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onSearchChange(e?.target?.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion?.text);
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const getSuggestionTypeColor = (type) => {
    const colors = {
      recent: 'text-blue-600',
      popular: 'text-green-600',
      suggestion: 'text-gray-600'
    };
    return colors?.[type] || colors?.suggestion;
  };

  const getSuggestionTypeLabel = (type) => {
    const labels = {
      recent: 'Recent',
      popular: 'Popular',
      suggestion: 'Suggested'
    };
    return labels?.[type] || '';
  };

  return (
    <div className="relative" ref={inputRef}>
      <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-105' : ''}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="Search" size={20} color="var(--color-insight-gray)" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search notes, roadmaps, interview questions..."
          className={`w-full pl-12 pr-20 py-4 bg-white border-2 rounded-xl font-inter text-wisdom-charcoal placeholder-insight-gray transition-all duration-300 ${
            isFocused 
              ? 'border-academic-blue shadow-brand-md' 
              : 'border-slate-200 hover:border-slate-300'
          }`}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-4">
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onSearchChange('');
                inputRef?.current?.focus();
              }}
              className="w-8 h-8"
            >
              <Icon name="X" size={16} color="var(--color-insight-gray)" />
            </Button>
          )}
          
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onFilterToggle}
              className="w-8 h-8"
            >
              <Icon name="SlidersHorizontal" size={16} color="var(--color-insight-gray)" />
            </Button>
          )}
        </div>
      </div>
      {/* AI-Powered Suggestions */}
      {showSuggestions && (searchQuery?.length > 0 || isFocused) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-brand-lg z-50 max-h-80 overflow-y-auto">
          {searchQuery?.length > 0 && (
            <div className="p-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-sm text-insight-gray mb-2">
                <Icon name="Sparkles" size={14} color="var(--color-academic-blue)" />
                <span className="font-medium">AI Suggestions</span>
              </div>
            </div>
          )}

          {filteredSuggestions?.length > 0 ? (
            <div className="py-2">
              {filteredSuggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface transition-colors duration-200 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={suggestion?.icon} 
                      size={16} 
                      color="var(--color-insight-gray)" 
                    />
                    <span className="text-wisdom-charcoal font-inter">
                      {suggestion?.text}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full bg-slate-100 ${getSuggestionTypeColor(suggestion?.type)}`}>
                    {getSuggestionTypeLabel(suggestion?.type)}
                  </span>
                </button>
              ))}
            </div>
          ) : searchQuery?.length > 0 ? (
            <div className="p-4 text-center">
              <Icon name="Search" size={24} color="var(--color-insight-gray)" className="mx-auto mb-2" />
              <p className="text-insight-gray text-sm">No suggestions found for "{searchQuery}"</p>
              <p className="text-xs text-insight-gray mt-1">Try different keywords or browse categories</p>
            </div>
          ) : (
            <div className="py-2">
              <div className="px-4 py-2">
                <h4 className="text-sm font-medium text-wisdom-charcoal mb-2">Recent Searches</h4>
                {suggestions?.filter(s => s?.type === 'recent')?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center space-x-3 px-2 py-2 hover:bg-surface rounded-lg transition-colors duration-200 text-left"
                  >
                    <Icon name="Clock" size={14} color="var(--color-insight-gray)" />
                    <span className="text-sm text-wisdom-charcoal">{suggestion?.text}</span>
                  </button>
                ))}
              </div>
              
              <div className="border-t border-slate-100 px-4 py-2">
                <h4 className="text-sm font-medium text-wisdom-charcoal mb-2">Popular This Week</h4>
                {suggestions?.filter(s => s?.type === 'popular')?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center space-x-3 px-2 py-2 hover:bg-surface rounded-lg transition-colors duration-200 text-left"
                  >
                    <Icon name="TrendingUp" size={14} color="var(--color-green-600)" />
                    <span className="text-sm text-wisdom-charcoal">{suggestion?.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;