const Toggle = require('../model/VMToggleButtons');

// GET toggle state
exports.getToggle = async (req, res) => {
  try {
    let toggle = await Toggle.findOne();
    if (!toggle) {
      toggle = await Toggle.create({ isClosed: false, isBuyDisabled: true });
    }
    res.json({ isClosed: toggle.isClosed, isBuyDisabled: toggle.isBuyDisabled });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST toggle state
exports.setToggle = async (req, res) => {
  try {
    const { isClosed, isBuyDisabled } = req.body;
    let toggle = await Toggle.findOne();

    if (!toggle) {
      toggle = await Toggle.create({
        isClosed: isClosed ?? false,
        isBuyDisabled: isBuyDisabled ?? true,
      });
    } else {
      if (typeof isClosed === 'boolean') toggle.isClosed = isClosed;
      if (typeof isBuyDisabled === 'boolean') toggle.isBuyDisabled = isBuyDisabled;
      await toggle.save();
    }

    res.json({
      isClosed: toggle.isClosed,
      isBuyDisabled: toggle.isBuyDisabled,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
