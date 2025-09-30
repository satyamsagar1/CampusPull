import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CareerRoadmapCard = ({ roadmap }) => {
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  const handleMilestoneClick = (milestoneId) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId);
  };

  const getProgressPercentage = () => {
    const completedMilestones = roadmap?.milestones?.filter(m => m?.completed)?.length;
    return (completedMilestones / roadmap?.milestones?.length) * 100;
  };

  const getMilestoneStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-500 border-green-500',
      current: 'bg-blue-500 border-blue-500',
      upcoming: 'bg-gray-300 border-gray-300',
      locked: 'bg-gray-200 border-gray-200'
    };
    return colors?.[status] || colors?.upcoming;
  };

  const getMilestoneIcon = (status) => {
    const icons = {
      completed: 'CheckCircle',
      current: 'Play',
      upcoming: 'Circle',
      locked: 'Lock'
    };
    return icons?.[status] || icons?.upcoming;
  };

  return (
    <div className="knowledge-card bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-brand-lg transition-all duration-300">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-academic-blue to-credibility-indigo overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative p-6 h-full flex items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Icon name="Route" size={24} color="white" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-white text-xl mb-1">
                {roadmap?.title}
              </h3>
              <p className="text-white text-opacity-90 text-sm">
                {roadmap?.duration} • {roadmap?.difficulty} Level
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-inter font-medium text-wisdom-charcoal">
            Progress: {Math.round(getProgressPercentage())}%
          </span>
          <span className="text-xs text-insight-gray">
            {roadmap?.milestones?.filter(m => m?.completed)?.length} of {roadmap?.milestones?.length} completed
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-academic-blue to-progress-emerald h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>
      {/* Milestones Timeline */}
      <div className="p-6">
        <div className="space-y-4">
          {roadmap?.milestones?.slice(0, 4)?.map((milestone, index) => (
            <div key={milestone?.id} className="relative">
              {/* Timeline Line */}
              {index < roadmap?.milestones?.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-8 bg-slate-200"></div>
              )}
              
              <div 
                className="flex items-start space-x-4 cursor-pointer"
                onClick={() => handleMilestoneClick(milestone?.id)}
              >
                {/* Milestone Icon */}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getMilestoneStatusColor(milestone?.status)}`}>
                  <Icon 
                    name={getMilestoneIcon(milestone?.status)} 
                    size={14} 
                    color="white" 
                  />
                </div>

                {/* Milestone Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-inter font-medium text-wisdom-charcoal text-sm">
                      {milestone?.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-insight-gray">
                        {milestone?.estimatedTime}
                      </span>
                      <Icon 
                        name={expandedMilestone === milestone?.id ? "ChevronUp" : "ChevronDown"} 
                        size={14} 
                        color="var(--color-insight-gray)" 
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-insight-gray mt-1">
                    {milestone?.description}
                  </p>

                  {/* Expanded Content */}
                  {expandedMilestone === milestone?.id && (
                    <div className="mt-3 p-3 bg-surface rounded-lg">
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-wisdom-charcoal">Key Skills:</h5>
                        <div className="flex flex-wrap gap-1">
                          {milestone?.skills?.map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-wisdom-charcoal"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        {milestone?.resources && (
                          <div className="mt-2">
                            <h5 className="text-xs font-medium text-wisdom-charcoal mb-1">Resources:</h5>
                            <div className="space-y-1">
                              {milestone?.resources?.map((resource, resourceIndex) => (
                                <div key={resourceIndex} className="flex items-center space-x-2">
                                  <Icon name="ExternalLink" size={12} color="var(--color-academic-blue)" />
                                  <span className="text-xs text-academic-blue hover:underline cursor-pointer">
                                    {resource?.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {roadmap?.milestones?.length > 4 && (
            <div className="text-center pt-2">
              <Button variant="ghost" size="sm" className="text-academic-blue">
                View All {roadmap?.milestones?.length} Milestones
                <Icon name="ChevronRight" size={14} className="ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="px-6 py-4 bg-surface border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image 
              src={roadmap?.mentor?.avatar} 
              alt={roadmap?.mentor?.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-insight-gray">
              by {roadmap?.mentor?.name}
            </span>
            {roadmap?.mentor?.verified && (
              <Icon name="BadgeCheck" size={14} color="var(--color-academic-blue)" />
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} color="var(--color-insight-gray)" />
              <span className="text-xs text-insight-gray">{roadmap?.followers}</span>
            </div>
            <Button 
              variant="default" 
              size="sm"
              className="bg-academic-blue hover:bg-blue-700"
              iconName="Play"
              iconPosition="left"
            >
              Start Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmapCard;

