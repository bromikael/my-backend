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

  console.log('Received data:', { aboutMe, skills, projects });
  console.log('User ID:', userId);

  try {
    const cvData = await cvdata.findOneAndUpdate(
      { userId },  // Find the document by user ID
      { aboutMe, skills, projects },  // Update fields
      { new: true, upsert: true }  // Create new if doesn't exist
    );
    res.json(cvData);
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
