import Connection from "../models/connectionModel.js";
import User from "../models/user.js";
import sendNotificationToUser from "../socket.js";

// Suggest Users to Connect
export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const { role } = req.query;

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
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const queryFilter = {
            _id: { $nin: excludeIds }
        };
        if (role && role !== 'all') {
            queryFilter.role = role;
        } else {
            queryFilter.role = { $in: ['student', 'teacher', 'alumni'] };
        }

        const totalSuggested = await User.countDocuments(queryFilter);

        const suggestedUsers = await User.find(queryFilter)
            .select("-password -passwordHash -tokenVersion")
            .skip(skip)
            .limit(limit);

        res.json({
            users: suggestedUsers,
            hasMore: skip + suggestedUsers.length < totalSuggested,
            total: totalSuggested
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔎 Search users
export const searchUsers = async (req, res) => {
    try {
        const { q, role } = req.query;

        if (!q || q.trim() === "") return res.json([]);

        const searchRegex = new RegExp(q, "i");

        // 1. Define the role criteria first
        let roleCriteria;
        if (role && role !== 'all') {
            roleCriteria = role;
        } else {
            roleCriteria = { $in: ['student', 'teacher', 'alumni'] };
        }

        // 2. Combine everything into one query object
        // This finds users who match the role AND (name OR skills)
        const users = await User.find({
            role: roleCriteria,
            $or: [
                { name: searchRegex },
                { skills: searchRegex } // Simplified: Mongoose handles regex in arrays automatically
            ]
        })
        .select("-passwordHash -tokenVersion")
        .limit(20);

        res.json(users);

    } catch (err) {
        // --- THIS IS CRITICAL ---
        // Look at your Node.js console/terminal. What does it say here?
        console.error("SEARCH CRASH LOG:", err.message); 
        res.status(500).json({ message: "Server Error", error: err.message });
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

            if (existingConnection.status === 'rejected') {
                existingConnection.status = 'pending';
                existingConnection.requester = requesterId;
                existingConnection.recipient = recipientId;
                await existingConnection.save();

                // --- NOTIFICATION TRIGGER (RE-SEND) ---
                const senderDetails = await User.findById(requesterId).select("name profileImage"); 

                await sendNotificationToUser({
                    recipientId: recipientId,
                    senderId: requesterId,
                    type: "connection_request",
                    message: `${senderDetails.name} sent you a connection request`,
                    data: {
                        relatedId: null, // Connection requests usually don't need a link, or link to profile
                        senderData: senderDetails // <--- CRITICAL: Pass full object for Frontend
                    }
                });
              

                return res.status(200).json(existingConnection);
            }
        }

        const connection = await Connection.create({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });

        // --- NOTIFICATION TRIGGER (NEW) ---
        const senderDetails = await User.findById(requesterId).select("name profileImage"); 

        await sendNotificationToUser({
            recipientId: recipientId,
            senderId: requesterId,
            type: "connection_request",
            message: `${senderDetails.name} sent you a connection request`,
            data: {
                senderData: senderDetails // <--- Ensures live alert has the Avatar
            }
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
        const userId = req.user.id; // The person ACCEPTING the request

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
            
            // --- NOTIFICATION TRIGGER (ACCEPTED) ---
            const accepter = await User.findById(userId).select("name profileImage");
            
            await sendNotificationToUser({
                recipientId: connection.requester,
                senderId: userId,
                type: "connection_accepted",
                message: `${accepter.name} accepted your connection request`,
                data: {
                    senderData: accepter
                }
            });
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
                { recipient: userId, status: "pending" }, 
                { requester: userId, status: "pending" }  
            ]
        }).populate("requester", "name email college degree skills graduationYear linkedin profileImage")
          .populate("recipient", "name email college degree skills graduationYear linkedin profileImage");

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
    })
      .populate(
        "requester",
        "name email role profileImage year skills college degree graduationYear linkedin"
      )
      .populate(
        "recipient",
        "name email role profileImage year skills college degree graduationYear linkedin"
      );

    const connectedUsers = [];

    for (const conn of connections) {
      if (!conn.requester || !conn.recipient) continue;

      if (String(conn.requester._id) === String(userId)) {
        connectedUsers.push(conn.recipient);
      } else {
        connectedUsers.push(conn.requester);
      }
    }

    res.status(200).json(connectedUsers);
  } catch (err) {
    console.error("Get Connections Error:", err);
    res.status(500).json({
      message: "Error fetching connections",
      error: err.message
    });
  }
};


// Get total connection count
export const getConnectionCount = async (req, res) => {
    try {
        const userId = req.user.id; 

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

export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const userProfile = await User.findById(id)
            .select("-password -passwordHash -tokenVersion");

        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(userProfile);

    } catch (err) {
        console.error("Get User Profile Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
