import React, { useContext, useState, useMemo } from "react"; // Added useMemo
import {
  FaSearch,
  FaUserCircle,
  FaLinkedin,
  FaEnvelope,
  FaUserPlus,
  FaUsers,
  FaSpinner
} from "react-icons/fa";
// Import the custom hook
import { useExplore } from "../../context/exploreContext"; 
import RequestsPage from "./RequestsPage";
import { useAuth } from "../../context/AuthContext"; // To get logged-in user info
import ConnectionsPage from "./connectionsPage";


export default function Explore() {
  // Get real data and functions from context
  const { 
    suggestions, 
    search, 
    setSearch, 
    loading, 
    error, 
    sendRequest, 
    incomingRequests, // Use this for the count
    outgoingRequestIds, // Use this to check button status
    connectionCount
  } = useExplore();

  const [activePage, setActivePage] = useState('explore'); // 'explore', 'requests', 'connections'

  const displayedUsers = suggestions;

  // --- Render based on activePage ---
  if (activePage === 'requests') {
    return <RequestsPage onBack={() => setActivePage('explore')} />;
  }
  if (activePage === 'connections') {
    return <ConnectionsPage onBack={() => setActivePage('explore')} />;
  }

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Explore Network</h1>
          <p className="text-gray-600 mt-1">Connect with students & mentors</p> 
        </div>
        <div className="flex gap-3">
          {/* Requests Button */}
          <button
            onClick={() => setActivePage('requests')} // <-- Set active page
            className="relative px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-medium shadow-md flex items-center gap-2 transition"
          >
            <FaUserPlus className="text-pink-500"/> Requests
            {incomingRequests?.length > 0 && (
               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                 {incomingRequests.length}
               </span>
            )}
          </button>
          {/* Connections Button */}
          <button
            onClick={() => setActivePage('connections')} // <-- Set active page
            className="relative px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-medium shadow-md flex items-center gap-2 transition"
          >
            <FaUsers className="text-blue-500"/> Connections
            {/* Display count if > 0 */}
            {connectionCount > 0 && (
               <span className="ml-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                 {connectionCount}
               </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center w-full max-w-xl bg-white/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 shadow-sm">
          <FaSearch className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search by name, college, degree, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      {/* --- REMOVED Top Rated Mentors Section --- */}
      {/* {!search && topRatedMentors.length > 0 && (
        <div className="mb-12">
           ... (section removed) ...
        </div>
      )}
      */}

      {/* All Users Grid Title */}
       <h2 className="text-2xl font-semibold text-gray-800 mb-4">
         {search ? `Search Results (${displayedUsers.length})` : "Suggestions"}
       </h2>

      {/* Loading and Error States */}
       {loading && (
         <div className="flex justify-center items-center py-10">
           <FaSpinner className="animate-spin text-blue-500 text-4xl" />
         </div>
       )}
       {error && <p className="text-center text-red-500 mt-6">{error}</p>}

      {/* All Users Grid */}
       {!loading && !error && (
         <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
           {displayedUsers.length > 0 ? (
             displayedUsers.map((user) => (
               <UserCard 
                 key={user._id} 
                 user={user} 
                 sendRequest={sendRequest} 
                 outgoingRequestIds={outgoingRequestIds} 
               />
             ))
           ) : (
             <p className="col-span-full text-center text-gray-600 py-10">
               {search ? "No profiles found matching your search." : "No suggestions available."}
             </p>
           )}
         </div>
       )}

    </div>
  );
}


// ===============================================
// --- User Card Component (Ratings Removed) ---
// ===============================================
const UserCard = ({ user: cardUser, sendRequest, outgoingRequestIds }) => { // Renamed user prop to cardUser
  // Get accepted IDs and incoming requests from context
  const { acceptedConnectionIds, incomingRequests } = useExplore();
  const { user: loggedInUser } = useAuth(); // Get the logged-in user

  // Prevent showing card for the logged-in user themselves
  if (loggedInUser?._id === cardUser._id) {
      return null; 
  }

  // --- Determine Connection Status ---
  const isConnected = acceptedConnectionIds.has(cardUser._id);
  const isRequestSent = outgoingRequestIds.has(cardUser._id);
  // Check if there's an incoming request *from this specific user*
  const hasIncomingRequest = incomingRequests.some(req => req.requester._id === cardUser._id);

  let buttonText = "Connect";
  let buttonDisabled = false;
  let buttonClasses = "bg-blue-600 text-white hover:bg-blue-700";

  if (isConnected) {
    buttonText = "Connected";
    buttonDisabled = true;
    buttonClasses = "bg-gray-100 text-gray-500 cursor-not-allowed";
  } else if (isRequestSent) {
    buttonText = "Request Sent";
    buttonDisabled = true;
    buttonClasses = "bg-green-100 text-green-700 cursor-not-allowed";
  } else if (hasIncomingRequest) {
    // Option 1: Show "Pending" and disable connect
    buttonText = "Request Received"; 
    buttonDisabled = true;
    buttonClasses = "bg-yellow-100 text-yellow-700 cursor-not-allowed";
    // Option 2: You could potentially show an "Accept" button here, 
    // but it might be better handled on the Requests page.
  }

  return (
      <div
        className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition transform hover:-translate-y-1"
      >
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full mb-4 overflow-hidden border-2 border-pink-200 shadow-md">
           {cardUser.avatar ? (
             <img src={cardUser.avatar} alt={cardUser.name} className="w-full h-full object-cover" />
           ) : (
             <FaUserCircle className="text-pink-500 text-6xl w-full h-full p-1" />
           )}
        </div>

        {/* Basic Info */}
        <h2 className="text-lg font-semibold text-gray-800 text-center">{cardUser.name}</h2>
        <p className="text-sm text-gray-500 text-center mb-1">{cardUser.college || "College not specified"}</p>
        <p className="text-sm text-gray-500 text-center mb-2">
          {cardUser.degree || ""} {cardUser.degree && cardUser.graduationYear ? `- ${cardUser.graduationYear}` : cardUser.graduationYear || ""}
        </p>

        {/* Skills */}
        {(cardUser.skills && cardUser.skills.length > 0) && (
          <p className="text-xs text-center text-blue-600 font-medium mb-3">
            {cardUser.skills.slice(0, 3).join(" • ")} {cardUser.skills.length > 3 ? '...' : ''}
          </p>
        )}
        
        {/* Contact Links */}
        <div className="flex space-x-4 mb-4 mt-2"> 
          {cardUser.email && (
            <a
              href={`mailto:${cardUser.email}`}
              className="text-gray-500 hover:text-pink-500 text-xl"
              title="Send Email"
              onClick={(e) => e.stopPropagation()} 
            >
              <FaEnvelope />
            </a>
          )}
          {cardUser.linkedin && (
            <a
              href={cardUser.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 text-xl"
              title="LinkedIn Profile"
              onClick={(e) => e.stopPropagation()} 
            >
              <FaLinkedin />
            </a>
          )}
        </div>

        {/* Connect Button (Updated) */}
        <button
          className={`mt-auto px-5 py-2 rounded-full font-medium text-sm transition ${buttonClasses}`}
          disabled={buttonDisabled}
          onClick={(e) => { 
              e.stopPropagation(); 
              // Only call sendRequest if the button is actually "Connect"
              if (!isConnected && !isRequestSent && !hasIncomingRequest) {
                  sendRequest(cardUser._id); 
              }
          }} 
        >
          {buttonText}
        </button>
      </div>
  );
};
