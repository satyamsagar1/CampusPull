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

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query param 'q' is required" });
    }

    const users = await user.find({
      $or: [
        { name: new RegExp(query, "i") },
        { skills: { $regex: query, $options: "i" } }
      ]
    }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error searching users", error: err.message });
  }
};

// Send connection request
export const sendConnectionRequest = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const requesterId = req.user.id;

        //prevent duplicate requests
        const existingRequest = await Connection.findOne({
            requester: requesterId,
            recipient: recipientId
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already sent" });
        }   
        const connection = await Connection.create({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });
        await connection.save();
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
}).populate("requester", "name email college degree skills")
 .populate("recipient", "name email college degree skills");
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
    }).populate("requester", "name email profilePic year skills")
    .populate("recipient", "name email profilePic year skills");

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