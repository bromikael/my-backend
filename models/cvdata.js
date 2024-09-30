const mongoose = require('mongoose');

const CvDataSchema = new mongoose.Schema({
    userId: {
      type: String, 
      required: true
    },
    aboutMe: {
      type: String,
      required: true
    },
    skills: {
      type: [String], 
      required: true
    },
    projects: [
      {
        name: String,
        description: String,
        link: String
      }
    ],
    // Add more fields as needed (education, certifications, etc.)
  });
  
  const CvData = mongoose.model('CvData', CvDataSchema);
  module.exports = CvData;