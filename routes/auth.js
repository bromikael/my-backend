const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerUser, generateToken } = require('../services/userService');
const router = express.Router();
const { pool } = require('../dbConfig'); 


router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  console.log('register attempt');

  try {
    const newUser = await registerUser(email, password);
    const token = generateToken(newUser.id);
    res.status(201).json({ token, user: newUser });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('login attempt');

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const user = userCheck.rows[0]; 

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user.id },  // Include user ID or other relevant info
      process.env.JWT_SECRET,  // Secret key from environment variables
      { expiresIn: '1h' }  // Set token expiry time
    );

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;