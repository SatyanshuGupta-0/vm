const ActiveUser = require('../model/VMActiveUser.model');

// Ping route to update session activity
exports.pingUser = async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    const now = new Date();

    if (!sessionId) {
      return res.status(400).json({ error: true, message: "Missing sessionId" });
    }

    await ActiveUser.findOneAndUpdate(
      { sessionId },
      {
        sessionId,
        ip,
        userAgent,
        lastSeen: now,
      },
      { upsert: true, new: true }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Ping error:", error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

// Get currently active users (within last 2s)
exports.getLiveUsers = async (req, res) => {
  try {
    const threshold = new Date(Date.now() - 2 * 1000); // 2s active window

    // Clean up stale sessions
    await ActiveUser.deleteMany({ lastSeen: { $lt: threshold } });

    // Count currently active users
    const liveUsers = await ActiveUser.countDocuments();
    res.json({ liveUsers });
  } catch (error) {
    console.error("Get live users error:", error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
