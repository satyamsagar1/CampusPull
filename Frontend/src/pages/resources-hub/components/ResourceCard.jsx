import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ResourceCard = ({ resource, viewMode = 'grid' }) => {
  const [isBookmarked, setIsBookmarked] = useState(resource?.isBookmarked || false);
  const [showPreview, setShowPreview] = useState(false);

  const handleBookmark = (e) => {
    e?.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleDownload = (e) => {
    e?.stopPropagation();
    // Trigger success celebration animation
    const button = e?.target?.closest('button');
    button?.classList?.add('success-celebration');
    setTimeout(() => {
      button?.classList?.remove('success-celebration');
    }, 600);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'text-green-600 bg-green-50 border-green-200',
      intermediate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      advanced: 'text-red-600 bg-red-50 border-red-200',
      expert: 'text-purple-600 bg-purple-50 border-purple-200'
    };
    return colors?.[difficulty] || colors?.beginner;
  };

  const getResourceTypeIcon = (type) => {
    const icons = {
      notes: 'FileText',
      roadmaps: 'Route',
      'interview-pyqs': 'MessageCircle',
      assignments: 'Clipboard',
      projects: 'Lightbulb',
      tutorials: 'Play'
    };
    return icons?.[type] || 'FileText';
  };

  if (viewMode === 'list') {
    return (
      <div className="knowledge-card bg-white border border-slate-200 rounded-xl p-6 hover:shadow-brand-lg transition-all duration-300">
        <div className="flex items-start space-x-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0 w-20 h-20 bg-surface rounded-lg overflow-hidden">
            <Image 
              src={resource?.thumbnail} 
              alt={resource?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-inter font-semibold text-wisdom-charcoal text-lg mb-1 line-clamp-1">
                  {resource?.title}
                </h3>
                <p className="text-insight-gray text-sm line-clamp-2 mb-3">
                  {resource?.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className="ml-2"
              >
                <Icon 
                  name={isBookmarked ? "Bookmark" : "BookmarkPlus"} 
                  size={18} 
                  color={isBookmarked ? "var(--color-academic-blue)" : "var(--color-insight-gray)"}
                />
              </Button>
            </div>

            {/* Meta Information */}
            <div className="flex items-center flex-wrap gap-3 mb-4">
              <div className="flex items-center space-x-1">
                <Icon name={getResourceTypeIcon(resource?.type)} size={14} color="var(--color-insight-gray)" />
                <span className="text-xs text-insight-gray capitalize">{resource?.type?.replace('-', ' ')}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(resource?.difficulty)}`}>
                {resource?.difficulty}
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} color="var(--color-achievement-amber)" />
                <span className="text-xs text-insight-gray">{resource?.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Download" size={14} color="var(--color-insight-gray)" />
                <span className="text-xs text-insight-gray">{resource?.downloads}</span>
              </div>
            </div>

            {/* Contributor & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image 
                  src={resource?.contributor?.avatar} 
                  alt={resource?.contributor?.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-insight-gray">by {resource?.contributor?.name}</span>
                {resource?.contributor?.verified && (
                  <Icon name="BadgeCheck" size={14} color="var(--color-academic-blue)" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                  Preview
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleDownload}
                  iconName="Download" 
                  iconPosition="left"
                  className="bg-academic-blue hover:bg-blue-700"
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="knowledge-card bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-brand-lg transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative h-48 bg-surface overflow-hidden">
        <Image 
          src={resource?.thumbnail} 
          alt={resource?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Icon 
              name={isBookmarked ? "Bookmark" : "BookmarkPlus"} 
              size={18} 
              color={isBookmarked ? "var(--color-academic-blue)" : "var(--color-insight-gray)"}
            />
          </Button>
        </div>
        <div className="absolute top-3 left-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getDifficultyColor(resource?.difficulty)}`}>
            {resource?.difficulty}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name={getResourceTypeIcon(resource?.type)} size={16} color="var(--color-insight-gray)" />
            <span className="text-xs text-insight-gray capitalize">{resource?.type?.replace('-', ' ')}</span>
          </div>
        </div>

        <h3 className="font-inter font-semibold text-wisdom-charcoal text-lg mb-2 line-clamp-2">
          {resource?.title}
        </h3>

        <p className="text-insight-gray text-sm line-clamp-3 mb-4">
          {resource?.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} color="var(--color-achievement-amber)" />
              <span className="text-xs text-insight-gray">{resource?.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Download" size={14} color="var(--color-insight-gray)" />
              <span className="text-xs text-insight-gray">{resource?.downloads}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={14} color="var(--color-insight-gray)" />
              <span className="text-xs text-insight-gray">{resource?.views}</span>
            </div>
          </div>
        </div>

        {/* Contributor */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Image 
              src={resource?.contributor?.avatar} 
              alt={resource?.contributor?.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-insight-gray">by {resource?.contributor?.name}</span>
            {resource?.contributor?.verified && (
              <Icon name="BadgeCheck" size={14} color="var(--color-academic-blue)" />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            iconName="Eye" 
            iconPosition="left"
          >
            Preview
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 bg-academic-blue hover:bg-blue-700"
            onClick={handleDownload}
            iconName="Download" 
            iconPosition="left"
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;