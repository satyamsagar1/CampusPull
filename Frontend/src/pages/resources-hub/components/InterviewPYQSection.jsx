import React, { useState, useMemo, useContext } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { ResourceContext } from '../../../context/resourceContext';

const InterviewPYQSection = ({ pyqs, onEditClick }) => {
  const { user } = useContext(ResourceContext);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Corrected difficulty levels to match backend controller
  const difficultyLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Easy', color: 'text-green-600' },
    { value: 'intermediate', label: 'Medium', color: 'text-yellow-600' },
    { value: 'advanced', label: 'Hard', color: 'text-red-600' }
  ];

  // Dynamically generate company filters from props
  const companyFilters = useMemo(() => {
    // Use (pyqs || []) to prevent error if pyqs is undefined
    const counts = (pyqs || []).reduce((acc, pyq) => {
      if (pyq.company) {
        acc[pyq.company] = (acc[pyq.company] || 0) + 1;
      }
      return acc;
    }, {});

    const sortedCompanies = Object.entries(counts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([name, count]) => ({ value: name, label: name, count }));

    return [
      { value: 'all', label: 'All Companies', count: pyqs?.length || 0 },
      ...sortedCompanies,
    ];
  }, [pyqs]);


  const filteredPYQs = (pyqs || []).filter(pyq => {
    const companyMatch = selectedCompany === 'all' || pyq?.company === selectedCompany;
    const difficultyMatch = selectedDifficulty === 'all' || pyq?.difficulty === selectedDifficulty;
    return companyMatch && difficultyMatch;
  });

  // Corrected difficulty keys
  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'text-green-600 bg-green-50 border-green-200',
      intermediate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      advanced: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors?.[difficulty] || colors?.intermediate;
  };

  // Helper to get display label for difficulty
  const getDifficultyLabel = (difficultyValue) => {
    return difficultyLevels.find(l => l.value === difficultyValue)?.label || difficultyValue;
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
          {/* Company Filter (Dynamic) */}
          <div>
            <label className="block text-sm font-medium text-wisdom-charcoal mb-2">
              Company
            </label>
            <div className="flex flex-wrap gap-2">
              {companyFilters?.map((company) => (
                <button
                  key={company?.value}
                  onClick={() => setSelectedCompany(company?.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                    selectedCompany === company?.value
                      ? 'bg-academic-blue text-white border-academic-blue shadow-brand-sm'
                      : 'bg-white text-wisdom-charcoal border-slate-200 hover:border-academic-blue hover:text-academic-blue'
                  }`}
                >
                  <span className={company?.color || ''}>{company?.label}</span>
                  <span className="ml-1 text-xs opacity-75">({company?.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter (Corrected) */}
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
        {filteredPYQs?.map((pyq) => {
          

          return (
            <div key={pyq?._id} className="knowledge-card bg-white border border-slate-200 rounded-xl p-6 hover:shadow-brand-lg transition-all duration-300">
              {/* Header - Corrected Data */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 p-1 flex-shrink-0 flex items-center justify-center">
                    {pyq.thumbnail ? (
                      <Image
                        src={pyq.thumbnail}
                        alt={pyq.company}
                        className="w-full h-full object-contain rounded-md"
                      />
                    ) : (
                      <Icon name="Briefcase" size={24} color="var(--color-academic-blue)" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-wisdom-charcoal text-lg">
                      {pyq?.company}
                    </h3>
                    <p className="text-insight-gray text-sm">{pyq?.title}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(pyq?.difficulty)}`}>
                    {getDifficultyLabel(pyq?.difficulty)}
                  </div>
                </div>
              </div>

              {/* Question Preview (using description field) */}
              <div className="mb-4">
                <h4 className="font-inter font-medium text-wisdom-charcoal mb-2">
                  Description:
                </h4>
                <div className="bg-surface p-4 rounded-lg border-l-4 border-academic-blue">
                  <p className="text-wisdom-charcoal text-sm leading-relaxed">
                    {pyq?.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Topics Covered (using tags) */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-wisdom-charcoal mb-2">Topics Covered:</h5>
                <div className="flex flex-wrap gap-2">
                  {pyq?.tags?.length > 0 ? (
                    pyq.tags.slice(0, 4).map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-100 text-wisdom-charcoal text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-insight-gray">No topics listed.</span>
                  )}
                  {pyq?.tags?.length > 4 && (
                    <span className="px-2 py-1 bg-slate-100 text-insight-gray text-xs rounded-full">
                      +{pyq?.tags?.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer - Corrected Data */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <Image
                    src={pyq?.uploadedBy?.avatar}
                    alt={pyq?.uploadedBy?.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-insight-gray">
                    by Campus-Pull {pyq?.uploadedBy?.name}
                  </span>
                  {pyq?.uploadedBy?.verified && (
                    <Icon name="BadgeCheck" size={14} color="var(--color-academic-blue)" />
                  )}
                </div>
                <div className="flex space-x-2">
                  {user?._id === pyq?.uploadedBy?._id && ( // <-- isOwner check
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onEditClick(pyq)} // <-- Use handler
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-academic-blue hover:bg-blue-700"
                    iconName="Download"
                    iconPosition="left"
                    onClick={() => window.open(pyq?.link, "_blank")}
                  >
                    Access
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* No Results Message */}
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
