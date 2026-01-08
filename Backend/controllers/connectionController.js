import Connection from "../models/connectionModel.js";
import User from "../models/user.js";
import sendNotificationToUser from "../socket.js";

// Suggest Users to Connect
export const getSuggestedUsers = async (req, res) => {
    try {
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

        const suggestedUsers = await User.find({
            _id: { $nin: excludeIds },
            role: { $in: ['student', 'teacher', 'alumni'] }
        })
            .select("-password")
            .skip((page - 1) * perPage)
            .limit(perPage);
        res.json(suggestedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔎 Search users
export const searchUsers = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query || typeof query !== "string" || query.trim() === "") {
            return res.json([]);
        }

        const searchRegex = new RegExp(query, "i");

        const users = await User.find({
            $and: [
                {
                    $or: [
                        { name: searchRegex },
                        { role: searchRegex },
                        { skills: { $in: [searchRegex] } }
                    ]
                },
                { role: { $in: ['student', 'teacher', 'alumni'] } }
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

        // 🔍 DEBUG: detect broken populated refs
requests.forEach(r => {
  if (!r.requester || !r.recipient) {
    console.log(
      "BROKEN CONNECTION:",
      r._id.toString(),
      "requester:", r.requester,
      "recipient:", r.recipient
    );
  }
});

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's connections
export const getConnections = async (req, res) => {
  console.log("REQ.USER:", req.user);

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
      // 🔥 THIS IS WHERE YOU LOG BROKEN IDS
      if (!conn.requester || !conn.recipient) {
        console.log(
          "BROKEN ACCEPTED CONNECTION ID:",
          conn._id.toString(),
          {
            requester: conn.requester,
            recipient: conn.recipient
          }
        );
        continue; // skip broken record safely
      }

      if (String(conn.requester._id) === String(userId)) {
        connectedUsers.push(conn.recipient);
      } else {
        connectedUsers.push(conn.requester);
      }
    }

    res.status(200).json(connectedUsers);
  } catch (err) {
    console.error("🔥 GET CONNECTIONS CRASH:", err);
    console.error("🔥 STACK:", err.stack);
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
