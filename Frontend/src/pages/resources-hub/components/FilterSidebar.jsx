import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, isMobile, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    subject: true,
    semester: true,
    university: false,
    difficulty: true,
    resourceType: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const filterSections = [
    {
      key: 'subject',
      title: 'Subject',
      icon: 'BookOpen',
      options: [
        { value: 'computer-science', label: 'Computer Science', count: 245 },
        { value: 'mathematics', label: 'Mathematics', count: 189 },
        { value: 'physics', label: 'Physics', count: 156 },
        { value: 'chemistry', label: 'Chemistry', count: 134 },
        { value: 'electronics', label: 'Electronics', count: 98 },
        { value: 'mechanical', label: 'Mechanical Engineering', count: 87 },
        { value: 'civil', label: 'Civil Engineering', count: 76 },
        { value: 'biotechnology', label: 'Biotechnology', count: 65 }
      ]
    },
    {
      key: 'semester',
      title: 'Semester',
      icon: 'Calendar',
      options: [
        { value: '1', label: '1st Semester', count: 89 },
        { value: '2', label: '2nd Semester', count: 92 },
        { value: '3', label: '3rd Semester', count: 156 },
        { value: '4', label: '4th Semester', count: 178 },
        { value: '5', label: '5th Semester', count: 203 },
        { value: '6', label: '6th Semester', count: 234 },
        { value: '7', label: '7th Semester', count: 189 },
        { value: '8', label: '8th Semester', count: 167 }
      ]
    },
    {
      key: 'university',
      title: 'University',
      icon: 'GraduationCap',
      options: [
        { value: 'iit-delhi', label: 'IIT Delhi', count: 234 },
        { value: 'iit-bombay', label: 'IIT Bombay', count: 198 },
        { value: 'iisc-bangalore', label: 'IISc Bangalore', count: 167 },
        { value: 'nit-trichy', label: 'NIT Trichy', count: 145 },
        { value: 'bits-pilani', label: 'BITS Pilani', count: 123 },
        { value: 'vit-vellore', label: 'VIT Vellore', count: 98 },
        { value: 'srm-chennai', label: 'SRM Chennai', count: 87 },
        { value: 'manipal', label: 'Manipal University', count: 76 }
      ]
    },
    {
      key: 'difficulty',
      title: 'Difficulty Level',
      icon: 'Target',
      options: [
        { value: 'beginner', label: 'Beginner', count: 456, color: 'text-green-600' },
        { value: 'intermediate', label: 'Intermediate', count: 389, color: 'text-yellow-600' },
        { value: 'advanced', label: 'Advanced', count: 234, color: 'text-red-600' },
        { value: 'expert', label: 'Expert', count: 123, color: 'text-purple-600' }
      ]
    },
    {
      key: 'resourceType',
      title: 'Resource Type',
      icon: 'FileText',
      options: [
        { value: 'notes', label: 'Study Notes', count: 567 },
        { value: 'roadmaps', label: 'Career Roadmaps', count: 234 },
        { value: 'interview-pyqs', label: 'Interview PYQs', count: 345 },
        { value: 'assignments', label: 'Assignments', count: 189 },
        { value: 'projects', label: 'Project Ideas', count: 156 },
        { value: 'tutorials', label: 'Video Tutorials', count: 123 }
      ]
    }
  ];

  const handleFilterChange = (section, value, checked) => {
    const currentValues = filters?.[section] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues?.filter(v => v !== value);
    
    onFilterChange(section, newValues);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters)?.reduce((count, filterArray) => count + (filterArray?.length || 0), 0);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} color="var(--color-academic-blue)" />
          <h3 className="font-inter font-semibold text-wisdom-charcoal">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-academic-blue text-white text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* Clear Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="p-4 border-b border-slate-200">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilters}
            className="w-full"
            iconName="RotateCcw"
            iconPosition="left"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto">
        {filterSections?.map((section) => (
          <div key={section?.key} className="border-b border-slate-200">
            <button
              onClick={() => toggleSection(section?.key)}
              className="w-full flex items-center justify-between p-4 hover:bg-surface transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <Icon name={section?.icon} size={18} color="var(--color-insight-gray)" />
                <span className="font-inter font-medium text-wisdom-charcoal">
                  {section?.title}
                </span>
              </div>
              <Icon 
                name={expandedSections?.[section?.key] ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                color="var(--color-insight-gray)" 
              />
            </button>

            {expandedSections?.[section?.key] && (
              <div className="px-4 pb-4 space-y-2">
                {section?.options?.map((option) => (
                  <label 
                    key={option?.value}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-surface cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={filters?.[section?.key]?.includes(option?.value) || false}
                        onChange={(e) => handleFilterChange(section?.key, option?.value, e?.target?.checked)}
                        className="w-4 h-4 text-academic-blue border-slate-300 rounded focus:ring-academic-blue focus:ring-2"
                      />
                      <span className={`text-sm font-inter ${option?.color || 'text-wisdom-charcoal'}`}>
                        {option?.label}
                      </span>
                    </div>
                    <span className="text-xs text-insight-gray bg-slate-100 px-2 py-1 rounded-full">
                      {option?.count}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
        <div className="bg-white w-full max-h-[80vh] rounded-t-2xl shadow-brand-xl">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-slate-200 shadow-brand-sm">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;