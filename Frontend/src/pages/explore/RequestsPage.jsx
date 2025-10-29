import React from "react";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
// Import the custom hook or the context itself
import { useExplore } from "../../context/exploreContext"; 

export default function RequestsPage({ onBack }) {
  // Get data and actions from the context
  const { incomingRequests, acceptRequest, ignoreRequest, loading } = useExplore();

  // Remove dummy data and handlers
  // const [incomingRequests, setIncomingRequests] = useState([...]);
  // const handleAccept = (id) => {...};
  // const handleIgnore = (id) => {...};
  // const handleViewProfile = (user) => {...};

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-white shadow-lg text-pink-500 rounded-full font-medium hover:bg-white/90 transition"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Incoming Requests</h1>

      {loading && <p className="text-center text-gray-600">Loading requests...</p>}
      
      {!loading && incomingRequests.length === 0 ? (
        <p className="text-gray-600 text-center">No incoming requests.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {incomingRequests.map((req) => (
            <div
              key={req._id} // Use the connection request ID
              className="p-6 bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg flex flex-col justify-between transition hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="mb-4">
                {/* Display requester info */}
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center font-semibold overflow-hidden">
                      {req.requester?.avatar ? (
                        <img src={req.requester.avatar} alt={req.requester.name} className="w-full h-full object-cover" />
                      ) : (
                        <FaUserCircle className="w-6 h-6" /> 
                      )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{req.requester.name}</h2>
                    <p className="text-sm text-gray-500">{req.requester.college}</p>
                    <p className="text-sm text-gray-500">
                      {req.requester.degree} - {req.requester.graduationYear}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  // Call acceptRequest with the connection ID
                  onClick={() => acceptRequest(req._id)} 
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full font-medium transition shadow"
                >
                  Accept
                </button>
                <button
                  // Call ignoreRequest with the connection ID
                  onClick={() => ignoreRequest(req._id)} 
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full font-medium transition shadow"
                >
                  Ignore
                </button>
                {/* You can add a link to the user's profile here if you have a profile page */}
                {/* <button
                  onClick={() => handleViewProfile(req.requester)} // View requester's profile
                  className="px-4 py-2 bg-white/50 hover:bg-white/70 text-pink-500 rounded-full font-medium transition shadow"
                >
                  View Profile
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}