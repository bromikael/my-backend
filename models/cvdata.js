const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CvDataSchema = new Schema({
  userId: { type: String, required: true },
  aboutMe: { type: String },
  skills: { type: [String] },
  projects: [
    {
      name: String,
      text: String,
      link: String,
    },
  ],
});

const CvData = mongoose.model('CvData', CvDataSchema);
module.exports = CvData;
