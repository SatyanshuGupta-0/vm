const ActiveUser = require('../model/VMActiveUser.model');

exports.pingUser = async (req, res) => {
  const ip = req.ip;
  const now = new Date();

  await ActiveUser.findOneAndUpdate(
    { ip },
    { lastSeen: now },
    { upsert: true, new: true }
  );

  res.sendStatus(200);
};

exports.getLiveUsers = async (req, res) => {
  const threshold = new Date(Date.now() - 2 * 1000); // 🕒 only 2 seconds of tolerance

  await ActiveUser.deleteMany({ lastSeen: { $lt: threshold } });

  const liveUsers = await ActiveUser.countDocuments();
  res.json({ liveUsers });
};
