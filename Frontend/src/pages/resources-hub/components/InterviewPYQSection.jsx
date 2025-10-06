import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const InterviewPYQSection = ({ pyqs }) => {
  const [selectedCompanyTier, setSelectedCompanyTier] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const companyTiers = [
    { value: 'all', label: 'All Companies', count: pyqs?.length },
    { value: 'tcs', label: 'TCS', count: pyqs?.filter(p => p?.companyTier === 'tcs')?.length, color: 'text-blue-600' },
    { value: 'accenture', label: 'Accenture', count: pyqs?.filter(p => p?.companyTier === 'accenture')?.length, color: 'text-purple-600' },
    { value: 'convolve', label: 'Convolve', count: pyqs?.filter(p => p?.companyTier === 'convolve')?.length, color: 'text-orange-600' },
    { value: 'blackorange', label: 'Black Orange', count: pyqs?.filter(p => p?.companyTier === 'blackorange')?.length, color: 'text-red-600' }
  ];

  const difficultyLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Easy', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'hard', label: 'Hard', color: 'text-red-600' }
  ];

  const filteredPYQs = pyqs?.filter(pyq => {
    const tierMatch = selectedCompanyTier === 'all' || pyq?.companyTier === selectedCompanyTier;
    const difficultyMatch = selectedDifficulty === 'all' || pyq?.difficulty === selectedDifficulty;
    return tierMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'text-green-600 bg-green-50 border-green-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      hard: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors?.[difficulty] || colors?.medium;
  };

  const getCompanyTierBadge = (tier) => {
    const badges = {
      tcs: { label: 'TCS', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      accenture: { label: 'Accenture', color: 'bg-purple-100 text-purple-700 border-purple-200' },
      convolve: { label: 'Convolve', color: 'bg-orange-100 text-orange-700 border-orange-200' },
      blackorange: { label: 'Black Orange', color: 'bg-red-100 text-red-700 border-red-200' }
    };
    return badges?.[tier] || { label: 'Company', color: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-academic-blue to-credibility-indigo rounded-lg flex items-center justify-center">
            <Icon name="MessageCircle" size={20} color="white" />
          </div>
          <div>
            <h2 className="font-poppins font-bold text-wisdom-charcoal text-xl">
              Interview PYQs
            </h2>
            <p className="text-insight-gray text-sm">
              Real questions from top companies
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-brand-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Tier Filter */}
          <div>
            <label className="block text-sm font-medium text-wisdom-charcoal mb-2">
              Company Tier
            </label>
            <div className="flex flex-wrap gap-2">
              {companyTiers?.map((tier) => (
                <button
                  key={tier?.value}
                  onClick={() => setSelectedCompanyTier(tier?.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                    selectedCompanyTier === tier?.value
                      ? 'bg-academic-blue text-white border-academic-blue shadow-brand-sm'
                      : 'bg-white text-wisdom-charcoal border-slate-200 hover:border-academic-blue hover:text-academic-blue'
                  }`}
                >
                  <span className={tier?.color || ''}>{tier?.label}</span>
                  <span className="ml-1 text-xs opacity-75">({tier?.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-wisdom-charcoal mb-2">
              Difficulty Level
            </label>
            <div className="flex flex-wrap gap-2">
              {difficultyLevels?.map((level) => (
                <button
                  key={level?.value}
                  onClick={() => setSelectedDifficulty(level?.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                    selectedDifficulty === level?.value
                      ? 'bg-academic-blue text-white border-academic-blue shadow-brand-sm'
                      : 'bg-white text-wisdom-charcoal border-slate-200 hover:border-academic-blue hover:text-academic-blue'
                  }`}
                >
                  <span className={level?.color || ''}>{level?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PYQ Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPYQs?.map((pyq) => (
          <div key={pyq?.id} className="knowledge-card bg-white border border-slate-200 rounded-xl p-6 hover:shadow-brand-lg transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Image 
                  src={pyq?.company?.logo} 
                  alt={pyq?.company?.name}
                  className="w-12 h-12 rounded-lg object-contain bg-slate-50 p-2"
                />
                <div>
                  <h3 className="font-inter font-semibold text-wisdom-charcoal text-lg">
                    {pyq?.company?.name}
                  </h3>
                  <p className="text-insight-gray text-sm">{pyq?.role}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getCompanyTierBadge(pyq?.companyTier)?.color}`}>
                  {getCompanyTierBadge(pyq?.companyTier)?.label}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(pyq?.difficulty)}`}>
                  {pyq?.difficulty}
                </div>
              </div>
            </div>

            {/* Question Preview */}
            <div className="mb-4">
              <h4 className="font-inter font-medium text-wisdom-charcoal mb-2">
                Sample Question:
              </h4>
              <div className="bg-surface p-4 rounded-lg border-l-4 border-academic-blue">
                <p className="text-wisdom-charcoal text-sm leading-relaxed">
                  {pyq?.sampleQuestion}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-academic-blue">
                  {pyq?.totalQuestions}
                </div>
                <div className="text-xs text-insight-gray">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-progress-emerald">
                  {pyq?.successRate}%
                </div>
                <div className="text-xs text-insight-gray">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-achievement-amber">
                  {pyq?.attempts}
                </div>
                <div className="text-xs text-insight-gray">Attempts</div>
              </div>
            </div>

            {/* Topics Covered */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-wisdom-charcoal mb-2">Topics Covered:</h5>
              <div className="flex flex-wrap gap-2">
                {pyq?.topics?.slice(0, 4)?.map((topic, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-slate-100 text-wisdom-charcoal text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
                {pyq?.topics?.length > 4 && (
                  <span className="px-2 py-1 bg-slate-100 text-insight-gray text-xs rounded-full">
                    +{pyq?.topics?.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Image 
                  src={pyq?.contributor?.avatar} 
                  alt={pyq?.contributor?.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-insight-gray">
                  by {pyq?.contributor?.name}
                </span>
                {pyq?.contributor?.verified && (
                  <Icon name="BadgeCheck" size={14} color="var(--color-academic-blue)" />
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                  Preview
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-academic-blue hover:bg-blue-700"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => window.open(pyq?.pdfUrl, "_blank")} 
                >
                  Access
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPYQs?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} color="var(--color-insight-gray)" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-wisdom-charcoal mb-2">No PYQs Found</h3>
          <p className="text-insight-gray">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default InterviewPYQSection;
