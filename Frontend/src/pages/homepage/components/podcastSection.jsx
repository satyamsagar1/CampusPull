import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Added for navigation
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PodcastSection = () => {
  const navigate = useNavigate();
  const [activeEpisode, setActiveEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // ✅ REAL DATA from your CampusPull Channel
  const episodes = [
    {
      id: 1,
      title: "College ki Baate | Ep. 3 | Riya Sharma | 7LPA",
      guest: "Riya Sharma",
      role: "Associate @ Contevolve",
      duration: "25 min",
      date: "Dec 16, 2025",
      youtubeId: "oJXNEOpPCoI", // Real ID
      // Auto-fetch high-res thumbnail from YouTube
      thumbnail: "https://img.youtube.com/vi/oJXNEOpPCoI/maxresdefault.jpg", 
      description: "Riya shares her journey of cracking a 7 LPA placement at Contevolve. She discusses her preparation strategy, interview rounds, and tips for freshers.",
      tags: ["Placement", "Contevolve", "Success Story"]
    },
    {
      id: 2,
      title: "College ki Baate | Ep.2 | Samyak Vansh",
      guest: "Samyak Vansh",
      role: "SDE @ BlackOrange",
      duration: "23 min",
      date: "Dec 09, 2025",
      youtubeId: "BuKWVegZKLI", // Real ID
      thumbnail: "https://img.youtube.com/vi/BuKWVegZKLI/maxresdefault.jpg",
      description: "A different kind of placement story. Samyak talks about his journey from Web3 & Data Science to securing a role at BlackOrange.",
      tags: ["Web3", "Data Science", "BlackOrange"]
    },
    {
      id: 3,
      title: "College ki Baate | Ep.1 | Swati Yadav",
      guest: "Swati Yadav",
      role: "Software Engineer",
      duration: "20 min",
      date: "Dec 02, 2025",
      youtubeId: "SH9OT4Sf5g8", // Real ID
      thumbnail: "https://img.youtube.com/vi/SH9OT4Sf5g8/maxresdefault.jpg",
      description: "Early placement secured! Swati Yadav shares her complete college placement experience and how she prepared for technical interviews.",
      tags: ["Early Placement", "Engineering", "Interview"]
    }
  ];

  const currentEp = episodes[activeEpisode];

  const handleEpisodeClick = (index) => {
    setActiveEpisode(index);
    setIsPlaying(true); // Auto-play when switching episodes
    // Scroll to top of player on mobile
    if (window.innerWidth < 768) {
       document.getElementById('main-player').scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-surface relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-academic-blue/5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                New Episodes
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-wisdom-charcoal">
              CampusPull Talks 🎙️
            </h2>
            <p className="text-lg text-insight-gray font-inter mt-2 max-w-xl">
              Real stories, raw conversations, and career secrets from alumni who made it big.
            </p>
          </div>
          <button
            onClick={() => window.open("https://youtube.com/@campuspull", "_blank")}
            className="hidden md:flex items-center space-x-2 text-academic-blue font-semibold hover:text-blue-700 transition-colors"
          >
            <span>View All Episodes</span>
            <Icon name="ArrowRight" size={20} />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Video Player Area (Left Side) */}
          <div className="lg:col-span-8" id="main-player">
            <div className="bg-white rounded-2xl shadow-brand-lg border border-slate-100 overflow-hidden flex flex-col h-full">
              
              {/* Video Container - 16:9 Aspect Ratio */}
              <div className="relative w-full aspect-video bg-black group">
                {!isPlaying ? (
                  // State 1: Cover Image (Facade - Loads Fast)
                  <>
                    <Image 
                      src={currentEp.thumbnail} 
                      alt={currentEp.title} 
                      className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Big Play Button */}
                    <button 
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center z-10"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform transition-transform duration-300 group-hover:scale-110">
                        <Icon name="Play" size={32} color="white" className="ml-1" fill="currentColor"/>
                      </div>
                    </button>

                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white pointer-events-none">
                      <div className="flex items-center space-x-3 mb-2 text-sm font-medium opacity-90">
                        <span className="px-2 py-0.5 bg-red-600 rounded text-xs font-bold">YOUTUBE</span>
                        <span>{currentEp.duration}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-poppins font-bold leading-tight line-clamp-2">
                        {currentEp.title}
                      </h3>
                    </div>
                  </>
                ) : (
                  // State 2: Actual YouTube Iframe (Loads on Click)
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentEp.youtubeId}?autoplay=1&rel=0`}
                    title={currentEp.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>

              {/* Video Meta Data */}
              <div className="p-6 sm:p-8 flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentEp.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-surface text-insight-gray text-xs font-medium rounded-full border border-slate-200">
                      #{tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-poppins font-bold text-wisdom-charcoal mb-2">
                  About this episode
                </h3>
                <p className="text-insight-gray font-inter leading-relaxed">
                  {currentEp.description}
                </p>
              </div>
            </div>
          </div>

          {/* Episode Playlist (Right Side) */}
          <div className="lg:col-span-4 flex flex-col space-y-4 h-auto lg:h-[600px] overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">
             {episodes.map((ep, index) => (
               <div 
                key={ep.id}
                onClick={() => handleEpisodeClick(index)}
                className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex gap-3 ${
                  activeEpisode === index 
                    ? 'bg-blue-50/50 border-academic-blue ring-1 ring-academic-blue/20' 
                    : 'bg-white border-slate-100 hover:border-academic-blue/30 hover:shadow-sm'
                }`}
               >
                 <div className="relative w-28 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                   <Image 
                    src={ep.thumbnail} 
                    alt={ep.guest} 
                    className="w-full h-full object-cover"
                   />
                   {activeEpisode === index && isPlaying && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="flex space-x-1 items-end h-3">
                          <div className="w-1 bg-white animate-[bounce_1s_infinite] h-2"></div>
                          <div className="w-1 bg-white animate-[bounce_1.2s_infinite] h-3"></div>
                          <div className="w-1 bg-white animate-[bounce_0.8s_infinite] h-2"></div>
                        </div>
                     </div>
                   )}
                 </div>
                 
                 <div className="flex-1 min-w-0 flex flex-col justify-center">
                   <h4 className={`font-poppins font-semibold text-sm line-clamp-2 mb-1 ${
                     activeEpisode === index ? 'text-academic-blue' : 'text-wisdom-charcoal'
                   }`}>
                     {ep.title}
                   </h4>
                   <p className="text-xs text-insight-gray truncate">
                     ft. {ep.guest}
                   </p>
                 </div>
               </div>
             ))}

            {/* Visit Channel Button */}
            <a
              href="https://youtube.com/@campuspull" 
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full py-3 flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors border border-red-200"
            >
              <Icon name="Youtube" size={20} />
              <span>Visit CampusPull Channel</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PodcastSection;