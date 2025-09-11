import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CommunityFeed = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = currentTime;
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const recentDiscussions = [
    {
      id: 1,
      title: "Best approach for System Design interviews at FAANG?",
      author: "Priya Sharma",
      authorAvatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      category: "Interview Prep",
      replies: 23,
      likes: 45,
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      tags: ["System Design", "FAANG", "Interviews"],
      isHot: true
    },
    {
      id: 2,
      title: "Data Structures study group - Week 3 progress",
      author: "Rahul Kumar",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      category: "Study Groups",
      replies: 12,
      likes: 28,
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      tags: ["DSA", "Study Group", "Progress"],
      isHot: false
    },
    {
      id: 3,
      title: "Machine Learning roadmap for beginners - Updated 2024",
      author: "Dr. Sneha Reddy",
      authorAvatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      category: "Career Guidance",
      replies: 67,
      likes: 134,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      tags: ["ML", "Roadmap", "Beginner"],
      isHot: true
    },
    {
      id: 4,
      title: "Anyone preparing for Google SWE internship 2024?",
      author: "Arjun Patel",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      category: "Internships",
      replies: 34,
      likes: 56,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      tags: ["Google", "Internship", "SWE"],
      isHot: false
    }
  ];

  const newResources = [
    {
      id: 1,
      title: "Complete React.js Interview Questions 2024",
      author: "Vikram Singh",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      type: "Interview PYQs",
      downloads: 234,
      rating: 4.8,
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      thumbnail: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts - ES6+",
      author: "Ananya Sharma",
      authorAvatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      type: "Study Material",
      downloads: 156,
      rating: 4.9,
      timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
      thumbnail: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      id: 3,
      title: "Product Manager Career Transition Guide",
      author: "Rajesh Kumar",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      type: "Career Roadmap",
      downloads: 89,
      rating: 4.7,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      thumbnail: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "System Design Masterclass with Google Engineer",
      speaker: "Amit Gupta",
      speakerAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      company: "Google",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      time: "7:00 PM IST",
      attendees: 234,
      type: "Webinar",
      isLive: false
    },
    {
      id: 2,
      title: "Mock Interview Session - Data Science Roles",
      speaker: "Dr. Priya Sharma",
      speakerAvatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      company: "Microsoft",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      time: "6:30 PM IST",
      attendees: 89,
      type: "Workshop",
      isLive: false
    },
    {
      id: 3,
      title: "Alumni Networking Night - Tech Professionals",
      speaker: "LinkeMate Team",
      speakerAvatar: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100",
      company: "LinkeMate",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      time: "8:00 PM IST",
      attendees: 156,
      type: "Networking",
      isLive: false
    }
  ];

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: 'MessageSquare', count: recentDiscussions?.length },
    { id: 'resources', label: 'New Resources', icon: 'BookOpen', count: newResources?.length },
    { id: 'events', label: 'Events', icon: 'Calendar', count: upcomingEvents?.length }
  ];

  const formatEventDate = (date) => {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return date?.toLocaleDateString('en-US', options);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-wisdom-charcoal mb-4">
            Live Community Activity
          </h2>
          <p className="text-xl text-insight-gray font-inter max-w-2xl mx-auto">
            Stay connected with real-time discussions, fresh resources, and upcoming events from our vibrant community
          </p>
        </div>

        {/* Activity Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="flex bg-surface rounded-lg p-1">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-inter font-medium transition-all duration-300 ${
                  activeTab === tab?.id
                    ? 'bg-white text-academic-blue shadow-brand-sm'
                    : 'text-insight-gray hover:text-wisdom-charcoal'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                <span>{tab?.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab?.id
                    ? 'bg-academic-blue text-white' :'bg-white text-insight-gray'
                }`}>
                  {tab?.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          
          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <div className="space-y-4">
              {recentDiscussions?.map((discussion) => (
                <div
                  key={discussion?.id}
                  className="knowledge-card bg-white rounded-xl p-6 shadow-brand-md border border-slate-100 hover:shadow-brand-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={discussion?.authorAvatar}
                        alt={discussion?.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-inter font-semibold text-wisdom-charcoal hover:text-academic-blue transition-colors duration-300 line-clamp-1">
                            {discussion?.title}
                          </h3>
                          {discussion?.isHot && (
                            <span className="px-2 py-0.5 bg-action-crimson text-white text-xs font-inter font-medium rounded-full flex items-center space-x-1">
                              <Icon name="Flame" size={10} />
                              <span>Hot</span>
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-insight-gray font-inter flex-shrink-0">
                          {getTimeAgo(discussion?.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-sm font-inter font-medium text-wisdom-charcoal">
                          {discussion?.author}
                        </span>
                        <span className="px-2 py-1 bg-academic-blue/10 text-academic-blue text-xs font-inter font-medium rounded-md">
                          {discussion?.category}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion?.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-surface text-insight-gray text-xs font-inter rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-insight-gray">
                        <div className="flex items-center space-x-1">
                          <Icon name="MessageCircle" size={16} />
                          <span>{discussion?.replies} replies</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Heart" size={16} />
                          <span>{discussion?.likes} likes</span>
                        </div>
                        <button className="flex items-center space-x-1 hover:text-academic-blue transition-colors duration-300">
                          <Icon name="Share2" size={16} />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              {newResources?.map((resource) => (
                <div
                  key={resource?.id}
                  className="knowledge-card bg-white rounded-xl p-6 shadow-brand-md border border-slate-100 hover:shadow-brand-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={resource?.thumbnail}
                        alt={resource?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-inter font-semibold text-wisdom-charcoal hover:text-academic-blue transition-colors duration-300 line-clamp-1">
                          {resource?.title}
                        </h3>
                        <span className="text-sm text-insight-gray font-inter flex-shrink-0">
                          {getTimeAgo(resource?.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src={resource?.authorAvatar}
                              alt={resource?.author}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm font-inter font-medium text-wisdom-charcoal">
                            {resource?.author}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-achievement-amber/10 text-achievement-amber text-xs font-inter font-medium rounded-md">
                          {resource?.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-insight-gray">
                        <div className="flex items-center space-x-1">
                          <Icon name="Download" size={16} />
                          <span>{resource?.downloads} downloads</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Star" size={16} color="#F59E0B" />
                          <span>{resource?.rating}</span>
                        </div>
                        <button className="flex items-center space-x-1 hover:text-academic-blue transition-colors duration-300">
                          <Icon name="Bookmark" size={16} />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {upcomingEvents?.map((event) => (
                <div
                  key={event?.id}
                  className="knowledge-card bg-white rounded-xl p-6 shadow-brand-md border border-slate-100 hover:shadow-brand-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-academic-blue to-credibility-indigo rounded-lg flex flex-col items-center justify-center text-white">
                        <span className="text-xs font-inter font-medium">
                          {formatEventDate(event?.date)?.split(' ')?.[0]}
                        </span>
                        <span className="text-lg font-poppins font-bold">
                          {formatEventDate(event?.date)?.split(' ')?.[2]}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-inter font-semibold text-wisdom-charcoal hover:text-academic-blue transition-colors duration-300 line-clamp-2">
                          {event?.title}
                        </h3>
                        <span className="px-2 py-1 bg-credibility-indigo/10 text-credibility-indigo text-xs font-inter font-medium rounded-md flex-shrink-0">
                          {event?.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src={event?.speakerAvatar}
                              alt={event?.speaker}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm font-inter font-medium text-wisdom-charcoal">
                            {event?.speaker}
                          </span>
                          <span className="text-sm text-insight-gray">
                            • {event?.company}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-insight-gray mb-4">
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={16} />
                          <span>{event?.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Users" size={16} />
                          <span>{event?.attendees} registered</span>
                        </div>
                      </div>
                      
                      <button className="px-4 py-2 bg-academic-blue hover:bg-blue-700 text-white text-sm font-inter font-medium rounded-lg transition-all duration-300">
                        Register Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center space-x-2 px-8 py-3 bg-white hover:bg-academic-blue text-academic-blue hover:text-white border-2 border-academic-blue font-inter font-medium rounded-lg transition-all duration-300 shadow-brand-md hover:shadow-brand-lg">
            <span>Join Community</span>
            <Icon name="ArrowRight" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommunityFeed;