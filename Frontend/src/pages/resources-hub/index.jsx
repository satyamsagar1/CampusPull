import React, { useState, useEffect } from 'react';
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

const ResourcesHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('all');

  // Mock data
  const mockResources = [
    {
      id: 1,
      title: "Complete Data Structures & Algorithms Notes",
      description: `Comprehensive notes covering all fundamental data structures including arrays, linked lists, stacks, queues, trees, graphs, and advanced algorithms.\n\nIncludes time complexity analysis, implementation examples in multiple languages, and practice problems with detailed solutions.`,
      type: "notes",
      difficulty: "intermediate",
      subject: "computer-science",
      semester: "3",
      university: "iit-delhi",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      rating: 4.8,
      downloads: 2340,
      views: 5670,
      isBookmarked: false,
      contributor: {
        name: "Arjun Sharma",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        verified: true
      }
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals Roadmap",
      description: `Step-by-step guide to mastering machine learning from basics to advanced concepts.\n\nCovers mathematics prerequisites, programming skills, popular algorithms, and hands-on projects with real-world datasets.`,
      type: "roadmaps",
      difficulty: "beginner",
      subject: "computer-science",
      semester: "5",
      university: "iit-bombay",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
      rating: 4.9,
      downloads: 1890,
      views: 4320,
      isBookmarked: true,
      contributor: {
        name: "Priya Patel",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        verified: true
      }
    },
    {
      id: 3,
      title: "FAANG Interview Questions - System Design",
      description: `Collection of system design questions asked in FAANG companies with detailed solutions.\n\nIncludes scalability concepts, database design, microservices architecture, and distributed systems fundamentals.`,
      type: "interview-pyqs",
      difficulty: "advanced",
      subject: "computer-science",
      semester: "7",
      university: "iisc-bangalore",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      rating: 4.7,
      downloads: 3210,
      views: 7890,
      isBookmarked: false,
      contributor: {
        name: "Rahul Gupta",
        avatar: "https://randomuser.me/api/portraits/men/56.jpg",
        verified: true
      }
    },
    {
      id: 4,
      title: "Physics Lab Manual - Quantum Mechanics",
      description: `Comprehensive lab manual for quantum mechanics experiments with theoretical background.\n\nIncludes experimental procedures, data analysis techniques, and interpretation of quantum phenomena.`,
      type: "assignments",
      difficulty: "advanced",
      subject: "physics",
      semester: "6",
      university: "nit-trichy",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
      rating: 4.6,
      downloads: 890,
      views: 2340,
      isBookmarked: false,
      contributor: {
        name: "Dr. Meera Singh",
        avatar: "https://randomuser.me/api/portraits/women/67.jpg",
        verified: true
      }
    },
    {
      id: 5,
      title: "Web Development Project Ideas",
      description: `Creative project ideas for full-stack web development with implementation guides.\n\nRanges from beginner-friendly projects to advanced applications using modern frameworks and technologies.`,
      type: "projects",
      difficulty: "intermediate",
      subject: "computer-science",
      semester: "4",
      university: "bits-pilani",
      thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
      rating: 4.5,
      downloads: 1560,
      views: 3780,
      isBookmarked: true,
      contributor: {
        name: "Vikash Kumar",
        avatar: "https://randomuser.me/api/portraits/men/23.jpg",
        verified: false
      }
    },
    {
      id: 6,
      title: "Calculus Video Tutorials Series",
      description: `Complete video series covering differential and integral calculus with solved examples.\n\nIncludes limits, derivatives, integrals, and applications in engineering and physics problems.`,
      type: "tutorials",
      difficulty: "beginner",
      subject: "mathematics",
      semester: "1",
      university: "vit-vellore",
      thumbnail: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop",
      rating: 4.4,
      downloads: 2100,
      views: 5430,
      isBookmarked: false,
      contributor: {
        name: "Anjali Reddy",
        avatar: "https://randomuser.me/api/portraits/women/89.jpg",
        verified: true
      }
    }
  ];

  const mockRoadmaps = [
    {
      id: 1,
      title: "Full Stack Developer",
      duration: "6-8 months",
      difficulty: "Intermediate",
      milestones: [
        {
          id: 1,
          title: "Frontend Fundamentals",
          description: "Master HTML, CSS, and JavaScript basics",
          status: "completed",
          estimatedTime: "4 weeks",
          skills: ["HTML5", "CSS3", "JavaScript ES6", "Responsive Design"],
          completed: true,
          resources: [
            { title: "MDN Web Docs", url: "#" },
            { title: "JavaScript.info", url: "#" }
          ]
        },
        {
          id: 2,
          title: "React Development",
          description: "Learn React.js and modern frontend development",
          status: "current",
          estimatedTime: "6 weeks",
          skills: ["React.js", "JSX", "Hooks", "State Management"],
          completed: false,
          resources: [
            { title: "React Official Docs", url: "#" },
            { title: "React Hooks Guide", url: "#" }
          ]
        },
        {
          id: 3,
          title: "Backend Development",
          description: "Build APIs with Node.js and Express",
          status: "upcoming",
          estimatedTime: "8 weeks",
          skills: ["Node.js", "Express.js", "REST APIs", "Authentication"],
          completed: false,
          resources: [
            { title: "Node.js Documentation", url: "#" },
            { title: "Express.js Guide", url: "#" }
          ]
        },
        {
          id: 4,
          title: "Database Integration",
          description: "Work with databases and data modeling",
          status: "upcoming",
          estimatedTime: "4 weeks",
          skills: ["MongoDB", "PostgreSQL", "Database Design", "ORMs"],
          completed: false,
          resources: [
            { title: "MongoDB University", url: "#" },
            { title: "PostgreSQL Tutorial", url: "#" }
          ]
        },
        {
          id: 5,
          title: "Deployment & DevOps",
          description: "Deploy applications and learn DevOps basics",
          status: "locked",
          estimatedTime: "3 weeks",
          skills: ["Docker", "AWS", "CI/CD", "Monitoring"],
          completed: false,
          resources: [
            { title: "Docker Documentation", url: "#" },
            { title: "AWS Getting Started", url: "#" }
          ]
        }
      ],
      mentor: {
        name: "Rohit Sharma",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        verified: true
      },
      followers: 1234
    },
    {
      id: 2,
      title: "Data Science Career Path",
      duration: "8-12 months",
      difficulty: "Advanced",
      milestones: [
        {
          id: 1,
          title: "Mathematics & Statistics",
          description: "Build strong mathematical foundation",
          status: "completed",
          estimatedTime: "6 weeks",
          skills: ["Linear Algebra", "Statistics", "Probability", "Calculus"],
          completed: true,
          resources: [
            { title: "Khan Academy Statistics", url: "#" },
            { title: "3Blue1Brown Linear Algebra", url: "#" }
          ]
        },
        {
          id: 2,
          title: "Python Programming",
          description: "Master Python for data science",
          status: "completed",
          estimatedTime: "4 weeks",
          skills: ["Python", "NumPy", "Pandas", "Matplotlib"],
          completed: true,
          resources: [
            { title: "Python.org Tutorial", url: "#" },
            { title: "Pandas Documentation", url: "#" }
          ]
        },
        {
          id: 3,
          title: "Machine Learning",
          description: "Learn ML algorithms and implementation",
          status: "current",
          estimatedTime: "10 weeks",
          skills: ["Scikit-learn", "Supervised Learning", "Unsupervised Learning", "Model Evaluation"],
          completed: false,
          resources: [
            { title: "Scikit-learn User Guide", url: "#" },
            { title: "Andrew Ng ML Course", url: "#" }
          ]
        },
        {
          id: 4,
          title: "Deep Learning",
          description: "Neural networks and deep learning frameworks",
          status: "upcoming",
          estimatedTime: "8 weeks",
          skills: ["TensorFlow", "PyTorch", "Neural Networks", "CNNs", "RNNs"],
          completed: false,
          resources: [
            { title: "TensorFlow Tutorials", url: "#" },
            { title: "Deep Learning Specialization", url: "#" }
          ]
        }
      ],
      mentor: {
        name: "Dr. Sneha Agarwal",
        avatar: "https://randomuser.me/api/portraits/women/78.jpg",
        verified: true
      },
      followers: 2156
    }
  ];

  const mockPYQs = [
    {
      id: 1,
      company: {
        name: "Google",
        logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop"
      },
      role: "Software Engineer",
      companyTier: "faang",
      difficulty: "hard",
      sampleQuestion: `Design a distributed cache system that can handle millions of requests per second. Consider consistency, availability, and partition tolerance. How would you handle cache invalidation and ensure data consistency across multiple nodes?`,
      totalQuestions: 45,
      successRate: 23,
      attempts: 1890,
      topics: ["System Design", "Distributed Systems", "Caching", "Scalability", "Consistency Models"],
      pdfUrl: "https://drive.google.com/file/d/1M7uhGEnw5_taUjZHV-Q_4rJso7eW4xP4/view?usp=sharing",
      contributor: {
        name: "Amit Verma",
        avatar: "https://randomuser.me/api/portraits/men/34.jpg",
        verified: true
      }
    },
    {
      id: 2,
      company: {
        name: "Microsoft",
        logo: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=100&h=100&fit=crop"
      },
      role: "Software Development Engineer",
      companyTier: "faang",
      difficulty: "medium",
      sampleQuestion: `Given a binary tree, write a function to determine if it's a valid binary search tree. What's the time and space complexity of your solution? Can you optimize it further?`,
      totalQuestions: 38,
      successRate: 45,
      attempts: 2340,
      topics: ["Data Structures", "Binary Trees", "BST", "Recursion", "Tree Traversal"],
      pdfUrl: "https://drive.google.com/file/d/1SnspQgdPwRNZpI1Q4-jxg0tTy8VWZejE/view?usp=sharing",
      contributor: {
        name: "Neha Joshi",
        avatar: "https://randomuser.me/api/portraits/women/56.jpg",
        verified: true
      }
    },
    {
      id: 3,
      company: {
        name: "Flipkart",
        logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop"
      },
      role: "Senior Software Engineer",
      companyTier: "unicorn",
      difficulty: "medium",
      sampleQuestion: `Design an e-commerce recommendation system. How would you handle real-time recommendations, cold start problems, and scalability? Discuss the trade-offs between different recommendation algorithms.`,
      totalQuestions: 32,
      successRate: 38,
      attempts: 1560,
      topics: ["Machine Learning", "Recommendation Systems", "Collaborative Filtering", "Content-Based Filtering", "Real-time Systems"],
      contributor: {
        name: "Rajesh Kumar",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        verified: true
      }
    },
    {
      id: 4,
      company: {
        name: "Infosys",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
      },
      role: "Technology Analyst",
      companyTier: "established",
      difficulty: "easy",
      sampleQuestion: `Explain the difference between SQL and NoSQL databases. When would you choose one over the other? Provide examples of use cases for each type of database.`,
      totalQuestions: 28,
      successRate: 67,
      attempts: 3210,
      topics: ["Databases", "SQL", "NoSQL", "Database Design", "ACID Properties"],
      contributor: {
        name: "Pooja Sharma",
        avatar: "https://randomuser.me/api/portraits/women/23.jpg",
        verified: false
      }
    },
    {
      id: 5,
      company: {
        name: "Zomato",
        logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop"
      },
      role: "Backend Developer",
      companyTier: "startup",
      difficulty: "medium",
      sampleQuestion: `Design a food delivery system like Zomato. How would you handle real-time order tracking, restaurant management, and delivery optimization? Consider scalability and user experience.`,
      totalQuestions: 25,
      successRate: 42,
      attempts: 890,
      topics: ["System Design", "Real-time Systems", "Geolocation", "Optimization", "Microservices"],
      contributor: {
        name: "Karan Singh",
        avatar: "https://randomuser.me/api/portraits/men/89.jpg",
        verified: true
      }
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (section, values) => {
    setFilters(prev => ({
      ...prev,
      [section]: values
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const filteredResources = mockResources?.filter(resource => {
    // Search query filter
    if (searchQuery && !resource?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) && 
        !resource?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())) {
      return false;
    }

    // Apply filters
    for (const [key, values] of Object.entries(filters)) {
      if (values && values?.length > 0 && !values?.includes(resource?.[key])) {
        return false;
      }
    }

    return true;
  });

  const sortedResources = [...filteredResources]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b?.id - a?.id;
      case 'popular':
        return b?.downloads - a?.downloads;
      case 'rating':
        return b?.rating - a?.rating;
      case 'downloads':
        return b?.downloads - a?.downloads;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
           {/* Add Profile Button in Header/Nav */}
  <div className="flex justify-end px-6 mb-4">
    <a
      href="/profile"
      className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
    >
      Profile
    </a>
  </div>
          <div className="flex">
            <div className="w-80 bg-white border-r border-slate-200 shadow-brand-sm">
              <div className="p-4 space-y-4">
                <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5]?.map(i => (
                    <div key={i} className="h-12 bg-slate-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 p-6">
              <LoadingSkeleton viewMode={viewMode} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Resources Hub - LinkeMate | Knowledge Without Boundaries</title>
        <meta name="description" content="Access comprehensive study materials, career roadmaps, and interview questions. Browse notes, tutorials, and resources contributed by top university alumni." />
        <meta name="keywords" content="study notes, career roadmaps, interview questions, university resources, academic materials, LinkeMate" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="pt-16">
          <div className="flex">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isMobile={false}
                onClose={() => {}}
              />
            </div>

            {/* Mobile Filter Modal */}
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
            <div className="flex-1 min-w-0">
              <div className="p-4 lg:p-6 space-y-6">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-academic-blue to-credibility-indigo rounded-2xl p-8 text-white">
                  <div className="max-w-3xl">
                    <h1 className="font-poppins font-bold text-3xl lg:text-4xl mb-4">
                      Resources Hub
                    </h1>
                    <p className="text-lg text-white text-opacity-90 mb-6">
                      Discover comprehensive study materials, career roadmaps, and interview questions curated by successful alumni from top universities.
                    </p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Icon name="FileText" size={18} />
                        <span>1,200+ Resources</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Users" size={18} />
                        <span>500+ Contributors</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Download" size={18} />
                        <span>50K+ Downloads</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onFilterToggle={() => setIsMobileFilterOpen(true)}
                  isMobile={window.innerWidth < 1024}
                />

                {/* Section Navigation */}
                <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-xl p-1 shadow-brand-sm">
                  {[
                    { key: 'all', label: 'All Resources', icon: 'Grid3X3' },
                    { key: 'notes', label: 'Study Notes', icon: 'FileText' },
                    { key: 'roadmaps', label: 'Career Roadmaps', icon: 'Route' },
                    { key: 'pyqs', label: 'Interview PYQs', icon: 'MessageCircle' }
                  ]?.map((section) => (
                    <button
                      key={section?.key}
                      onClick={() => setActiveSection(section?.key)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeSection === section?.key
                          ? 'bg-academic-blue text-white shadow-brand-sm'
                          : 'text-wisdom-charcoal hover:bg-surface'
                      }`}
                    >
                      <Icon name={section?.icon} size={16} />
                      <span>{section?.label}</span>
                    </button>
                  ))}
                </div>

                {/* All Resources Section */}
                {(activeSection === 'all' || activeSection === 'notes') && (
                  <div className="space-y-6">
                    <ViewToggle
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      totalResults={sortedResources?.length}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                    />

                    {/* Resources Grid/List */}
                    {sortedResources?.length > 0 ? (
                      <div className={`grid gap-6 ${
                        viewMode === 'grid' ?'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' :'grid-cols-1'
                      }`}>
                        {sortedResources?.map((resource) => (
                          <ResourceCard
                            key={resource?.id}
                            resource={resource}
                            viewMode={viewMode}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Icon name="Search" size={48} color="var(--color-insight-gray)" className="mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-wisdom-charcoal mb-2">No Resources Found</h3>
                        <p className="text-insight-gray mb-4">Try adjusting your search or filters to find what you're looking for.</p>
                        <Button variant="outline" onClick={handleClearFilters}>
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Career Roadmaps Section */}
                {(activeSection === 'all' || activeSection === 'roadmaps') && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-academic-blue to-credibility-indigo rounded-lg flex items-center justify-center">
                          <Icon name="Route" size={20} color="white" />
                        </div>
                        <div>
                          <h2 className="font-poppins font-bold text-wisdom-charcoal text-xl">
                            Career Roadmaps
                          </h2>
                          <p className="text-insight-gray text-sm">
                            Interactive learning paths to your dream career
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" iconName="Plus" iconPosition="left">
                        Create Roadmap
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {mockRoadmaps?.map((roadmap) => (
                        <CareerRoadmapCard key={roadmap?.id} roadmap={roadmap} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Interview PYQs Section */}
                {(activeSection === 'all' || activeSection === 'pyqs') && (
                  <InterviewPYQSection pyqs={mockPYQs} />
                )}

                {/* Load More Button */}
                {activeSection === 'all' && sortedResources?.length > 0 && (
                  <div className="text-center pt-8">
                    <Button 
                      variant="outline" 
                      size="lg"
                      iconName="ChevronDown"
                      iconPosition="right"
                    >
                      Load More Resources
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



export default ResourcesHub;