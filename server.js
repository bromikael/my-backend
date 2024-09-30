require('dotenv').config();
const express = require('express');
const { connectMongoDB, pool } = require('./dbConfig'); 
const cors = require('cors'); 
const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/Cv');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true
}));

app.use(express.json());

connectMongoDB();

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection error:', err.message);
  } else {
    console.log('PostgreSQL connected successfully:', res.rows[0]);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
