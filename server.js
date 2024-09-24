require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import CORS middleware
const authRoutes = require('./routes/auth');
const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

const { MongoClient, ServerApiVersion } = require('mongodb');

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend (React)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true // Allow credentials such as cookies, headers, etc.
}));

// Middleware for parsing JSON bodies
app.use(express.json());

 mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));

// Use authentication routes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
