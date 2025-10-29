import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import FilterSidebar from './components/FilterSidebar';
import SearchBar from './components/SearchBar';
import ViewToggle from './components/ViewToggle';
import ResourceCard from './components/ResourceCard';
import CareerRoadmapCard from './components/CareerRoadmapCard';
import InterviewPYQSection from './components/InterviewPYQSection';
import LoadingSkeleton from './components/LoadingSkeleton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { ResourceContext } from '../../context/resourceContext';
import UploadModal from './components/uploadModel';
import EditResourceModal from './components/EditResourceModal';
import { useAuth } from '../../context/AuthContext';

const ResourcesHub = () => {
  const { resources, roadmaps, pyqs, loading } = useContext(ResourceContext);
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const handleFilterChange = (section, values) => {
    setFilters(prev => ({ ...prev, [section]: values }));
  };

  const handleClearFilters = () => setFilters({});
  const canUpload = user?.role !== 'student';

  
  // Filter resources
  const filteredResources = resources?.filter(resource => {
    if (
      searchQuery &&
      !resource?.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !resource?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    for (const [key, values] of Object.entries(filters)) {
      if (values?.length > 0 && !values.includes(resource?.[key])) return false;
    }

    return true;
  });

  const sortedResources = [...filteredResources]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popular':
        return (b.downloads || 0) - (a.downloads || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'downloads':
        return (b.downloads || 0) - (a.downloads || 0);
      default:
        return 0;
    }
  });
  const totalResourceCount = (resources?.length || 0) + (roadmaps?.length || 0) + (pyqs?.length || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex">
          <div className="w-80 bg-white border-r border-slate-200 shadow-brand-sm p-4">
            <div className="h-8 bg-slate-200 rounded animate-pulse mb-4"></div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-slate-200 rounded animate-pulse mb-2"></div>
            ))}
          </div>
          <div className="flex-1 p-6">
            <LoadingSkeleton viewMode={viewMode} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Resources Hub - Campus-Pull | Knowledge Without Boundaries</title>
        <meta
          name="description"
          content="Access comprehensive study materials, career roadmaps, and interview questions. Browse notes, tutorials, and resources contributed by top university alumni."
        />
        <meta
          name="keywords"
          content="study notes, career roadmaps, interview questions, university resources, academic materials, CampusPUll"
        />
      </Helmet>

      <div className="min-h-screen bg-background relative">
        <Header />

        <div className="pt-16 flex">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMobile={false}
              onClose={() => {}}
            />
          </div>

          {/* Mobile Filter */}
          {isMobileFilterOpen && (
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMobile={true}
              onClose={() => setIsMobileFilterOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0 p-4 lg:p-6 space-y-6">
            {/* Hero */}
            <div className="bg-gradient-to-r from-academic-blue to-credibility-indigo rounded-2xl p-8 text-white">
              <h1 className="font-poppins font-bold text-3xl lg:text-4xl mb-4">Resources Hub</h1>
              <p className="text-lg text-white text-opacity-90 mb-6">
                Discover comprehensive study materials, career roadmaps, and interview questions curated by successful alumni from top universities.
              </p>
            </div>

            {/* Search */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterToggle={() => setIsMobileFilterOpen(true)}
              isMobile={window.innerWidth < 1024}
            />

            {/* Section Tabs */}
            <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-xl p-1 shadow-brand-sm">
              {[
               { key: 'all', label: `All Resources (${totalResourceCount})`, icon: 'Grid3X3' },
               { key: 'notes', label: `Study Notes (${resources?.length || 0})`, icon: 'FileText' },
               { key: 'roadmaps', label: `Career Roadmaps (${roadmaps?.length || 0})`, icon: 'Route' },
               { key: 'pyqs', label: `Interview PYQs (${pyqs?.length || 0})`, icon: 'MessageCircle' }
              ].map(section => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === section.key ? 'bg-academic-blue text-white shadow-brand-sm' : 'text-wisdom-charcoal hover:bg-surface'
                  }`}
                >
                  <Icon name={section.icon} size={16} />
                  <span>{section.label}</span>
                </button>
              ))}
            </div>

            {/* Resources Section */}
            {(activeSection === 'all' || activeSection === 'notes') && (
              <div className="space-y-6">
                <ViewToggle
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  totalResults={sortedResources?.length}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />

                {sortedResources?.length > 0 ? (
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {sortedResources.map(resource => (
                      <ResourceCard key={resource._id} resource={resource} viewMode={viewMode} onEditClick={(resource) => setEditingResource(resource)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Search" size={48} color="var(--color-insight-gray)" className="mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-wisdom-charcoal mb-2">No Resources Found</h3>
                    <p className="text-insight-gray mb-4">Try adjusting your search or filters to find what you're looking for.</p>
                    <Button variant="outline" onClick={handleClearFilters}>Clear All Filters</Button>
                  </div>
                )}
              </div>
            )}

            {/* Career Roadmaps Section */}
            {(activeSection === 'all' || activeSection === 'roadmaps') && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {roadmaps?.map(roadmap => (
                    <CareerRoadmapCard 
                    key={roadmap._id} 
                    roadmap={roadmap} 
                    onEditClick={(roadmap) => setEditingResource(roadmap)}
                  />
                  ))}
                </div>
              </div>
            )}

            {/* Interview PYQs Section */}
            {(activeSection === 'all' || activeSection === 'pyqs') && (
              <InterviewPYQSection pyqs={pyqs}
              onEditClick={(pyq) => setEditingResource(pyq)} />
            )}
          </div>
        </div>

        {/* Upload Button (Conditional) */}
      {canUpload && ( // <-- Add this condition
        <button
          className="fixed bottom-6 right-6 bg-academic-blue hover:bg-academic-blue-dark text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center"
          onClick={() => setIsUploadOpen(true)}
          title="Upload Resource"
        >
          <Icon name="Plus" size={20} />
        </button>
      )}

      {/* Upload Modal (for CREATE) */}
      {isUploadOpen && (
        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
        />
      )}

      {/* Edit Modal (for UPDATE) */}
      {editingResource && (
        <EditResourceModal
          isOpen={!!editingResource}
          onClose={() => setEditingResource(null)}
          resource={editingResource} 
        />
      )}
      </div>
    </>
  );
};

export default ResourcesHub;
