import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const CareerRoadmapCard = ({ roadmap }) => {
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [milestones, setMilestones] = useState(roadmap?.milestones || []);
  const [isStarted, setIsStarted] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [completedBadge, setCompletedBadge] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load saved progress
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`progress-${roadmap.id}`));
    if (saved) {
      setMilestones(saved.milestones);
      setIsStarted(saved.isStarted);
      if (saved.milestones.every(m => m.completed)) {
        setCompletedBadge(true);
      }
    }
  }, [roadmap.id]);

  // Save progress and check completion
  useEffect(() => {
    localStorage.setItem(
      `progress-${roadmap.id}`,
      JSON.stringify({ milestones, isStarted })
    );
    const progress = getProgressPercentage();
    if (progress === 100 && !completedBadge) {
      setShowAchievement(true);
      setCompletedBadge(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // confetti disappears after 3s
    }
  }, [milestones, isStarted]);

  const handleMilestoneClick = (milestoneId) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId);
  };

  const toggleCompletion = (milestoneId) => {
    const updated = milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    setMilestones(updated);
  };

  const getProgressPercentage = () => {
    const completedMilestones = milestones.filter((m) => m?.completed).length;
    return (completedMilestones / milestones.length) * 100;
  };

  const getMilestoneStatusColor = (completed) =>
    completed ? "bg-green-500 border-green-500" : "bg-gray-300 border-gray-300";

  const getMilestoneIcon = (completed) =>
    completed ? "CheckCircle" : "Circle";

  return (
    <>
      <div className="knowledge-card relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Achievement Badge */}
        {completedBadge && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg relative">
            🏆
            {/* Confetti */}
            {showConfetti && (
              <>
                <span className="confetti confetti-1"></span>
                <span className="confetti confetti-2"></span>
                <span className="confetti confetti-3"></span>
                <span className="confetti confetti-4"></span>
                <span className="confetti confetti-5"></span>
              </>
            )}
          </div>
        )}

        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-academic-blue to-credibility-indigo overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative p-6 h-full flex items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Icon name="Route" size={24} color="white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xl mb-1">{roadmap?.title}</h3>
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
            <span className="text-sm font-medium text-gray-700">
              Progress: {Math.round(getProgressPercentage())}%
            </span>
            <span className="text-xs text-gray-500">
              {milestones.filter((m) => m?.completed)?.length} of {milestones.length} completed
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-academic-blue to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Milestones */}
        <div className="p-6 space-y-4">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative">
              {index < milestones.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-8 bg-slate-200"></div>
              )}

              <div
                className="flex items-start space-x-4 cursor-pointer"
                onClick={() => handleMilestoneClick(milestone.id)}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompletion(milestone.id);
                  }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getMilestoneStatusColor(
                    milestone?.completed
                  )}`}
                >
                  <Icon
                    name={getMilestoneIcon(milestone?.completed)}
                    size={14}
                    color="white"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800 text-sm">{milestone?.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{milestone?.estimatedTime}</span>
                      <Icon
                        name={expandedMilestone === milestone.id ? "ChevronUp" : "ChevronDown"}
                        size={14}
                        color="gray"
                      />
                    </div>
                  </div>

                  {expandedMilestone === milestone.id && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-gray-600">{milestone?.description}</p>
                      {milestone?.resources && (
                        <div className="mt-2">
                          <h5 className="text-xs font-medium text-gray-700 mb-1">Resources:</h5>
                          <ul className="space-y-1">
                            {milestone.resources.map((res, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-2 text-xs text-blue-600 cursor-pointer hover:underline"
                              >
                                <Icon name="ExternalLink" size={12} />
                                {res.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <a href={roadmap?.image} download={`${roadmap?.title || "roadmap"}.png`}>
              <Button variant="outline" size="sm" iconName="Download" className="mr-2">
                Download Roadmap
              </Button>
            </a>

            <Button
              variant="default"
              size="sm"
              className="bg-academic-blue hover:bg-blue-700"
              iconName="Play"
              onClick={() => setIsStarted(true)}
            >
              {isStarted ? "Resume Journey" : "Start Journey"}
            </Button>
          </div>
          <p className="text-xs text-center mt-2 text-gray-500">Created by CampusPull</p>
        </div>
      </div>

      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <h2 className="text-xl font-bold text-green-600 mb-2">🎉 Congratulations!</h2>
            <p className="text-gray-700 mb-4">
              You have completed the <strong>{roadmap.title}</strong> roadmap!
            </p>
            <Button
              variant="default"
              size="sm"
              className="bg-academic-blue hover:bg-blue-700"
              onClick={() => setShowAchievement(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Confetti CSS */}
      <style jsx>{`
        .confetti {
          position: absolute;
          width: 6px;
          height: 6px;
          background: red;
          top: 0;
          animation: fall 1.5s linear infinite;
          border-radius: 50%;
        }
        .confetti-1 { left: 10%; background: #f59e0b; animation-delay: 0s; }
        .confetti-2 { left: 30%; background: #10b981; animation-delay: 0.2s; }
        .confetti-3 { left: 50%; background: #3b82f6; animation-delay: 0.4s; }
        .confetti-4 { left: 70%; background: #ef4444; animation-delay: 0.6s; }
        .confetti-5 { left: 90%; background: #8b5cf6; animation-delay: 0.8s; }

        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(50px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default CareerRoadmapCard;
