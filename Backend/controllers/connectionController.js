import Connection from "../models/connectionModel.js";
import user from "../models/user.js";

//Suggest Users to Connect

export const getSuggestedUsers = async (req, res) => {
    try{
    const userId = req.user.id;

    const existingConnections = await Connection.find({
        $or: [
            { requester: userId },
            { recipient: userId }
        ]
    });

    const excludeIds = existingConnections.map(conn => 
        conn.requester.toString() === userId ? conn.recipient : conn.requester
    );
    excludeIds.push(userId);

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const suggestedUsers = await user.find({
         _id: { $nin: excludeIds }})
        .select("-password")
        .skip((page - 1) * perPage)
        .limit(perPage);
        res.json(suggestedUsers);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// 🔎 Search users
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    // Safety check for empty query
    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.json([]); // Return empty array instead of error if search is empty
    }

    // Create a standardized Regex (Case Insensitive)
    const searchRegex = new RegExp(query, "i");

    const users = await user.find({
      $or: [
        { name: searchRegex },               
        { role: searchRegex },              
        { skills: { $in: [searchRegex] } } 
      ]
    })
    .select("-passwordHash -tokenVersion");  

    res.json(users);

  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Error searching users", error: err.message });
  }
};

// Send connection request
export const sendConnectionRequest = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const requesterId = req.user.id;

        if (requesterId === recipientId) {
             return res.status(400).json({ message: "You cannot connect with yourself." });
        }

        const existingConnection = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId } 
            ]
        });

        if (existingConnection) {
            if (existingConnection.status === 'accepted') {
                return res.status(400).json({ message: "Already connected" });
            } 
            
            if (existingConnection.status === 'pending') {
                 if (existingConnection.requester.toString() === requesterId) {
                    return res.status(400).json({ message: "Request already sent" });
                 } else {
                    return res.status(400).json({ message: "User already sent you a request. Check your inbox." });
                 }
            }

            // ✅ CRITICAL FIX: If status is 'rejected', UPDATE the existing doc. Do not create a new one.
            if (existingConnection.status === 'rejected') {
                existingConnection.status = 'pending';
                existingConnection.requester = requesterId; // Reset who is asking
                existingConnection.recipient = recipientId;
                await existingConnection.save();
                return res.status(200).json(existingConnection);
            }
        }

        // Create new only if absolutely no relationship exists
        const connection = await Connection.create({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });

        res.status(201).json(connection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Accept connection request
export const respondToConnectionRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body;
        const userId = req.user.id;
        

        const connection = await Connection.findOne({
            _id: requestId,
            recipient: userId,
            status: 'pending'
        });
        if (!connection) {
            return res.status(404).json({ message: "Connection request not found" });
        }
        if (action === 'accept') {
            connection.status = 'accepted';
        } 
        if (action === 'reject') {
            connection.status = 'rejected';
        }
        await connection.save();
        res.status(200).json(connection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }       
};

export const getPendingRequests = async (req, res) => {
  try {

    const userId = req.user.id;

    const requests = await Connection.find({
      $or: [
    { recipient: userId, status: "pending" }, // incoming
    { requester: userId, status: "pending" }  // outgoing
  ]
}).populate("requester", "name email college degree skills graduationYear linkedin profileImage")
 .populate("recipient", "name email college degree skills graduationYear linkedin profileImage");
    // populate requester details to show in UI

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get user's connections
export const getConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const connections = await Connection.find({
      $or: [
        { requester: userId, status: "accepted" },
        { recipient: userId, status: "accepted" }
      ]
    }).populate("requester", "name email role profileImage year skills college degree graduationYear linkedin ")
    .populate("recipient", "name email role profileImage year skills college degree graduationYear linkedin ");

    const connectedUsers = connections.map((conn) => {
      return conn.requester._id.toString() === userId
        ? conn.recipient
        : conn.requester;
    });

    res.json(connectedUsers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching connections", error: err.message });
  }
};

// Get total connection count
export const getConnectionCount = async (req, res) => {
  try {
    const userId = req.user.id; // or pass in req.params.userId if checking for another user

    const count = await Connection.countDocuments({
      $or: [
        { requester: userId },
        { recipient: userId }
      ],
      status: "accepted"
    });

    res.json({ totalConnections: count });
  } catch (error) {
    res.status(500).json({ message: "Error counting connections", error: error.message });
  }
};