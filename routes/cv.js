const express = require('express');
const cvdata = require('../models/CvData');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/load', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const cvData = await cvdata.findOne({ userId });
    if (!cvData) {
      return res.status(404).json({ message: 'No CV data found' });
    }
    res.json(cvData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/save', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { aboutMe, skills, projects } = req.body;

  try {
    const cvData = await cvdata.findOneAndUpdate(
      { userId },
      { aboutMe, skills, projects },
      { new: true, upsert: true } 
    );
    res.json(cvData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
