// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const pool = require('../dbConfig'); // Import the PostgreSQL pool
const saltRounds = 10;


router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  console.log('register attempt');

  try {
    // Check if the user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const newUser = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    // Respond with the newly created user (or a success message)
    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('login attempt');

  try {
    // Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const user = userCheck.rows[0]; // Retrieve the first result

    // Compare the input password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Password matches, successful login
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;

// Register User
/* router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if user already exists
    let user = await users.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new users({ name, email, password });
    await user.save();

    // Create and send JWT token
    const token = jwt.sign({ userId: user._id }, 'jwtSecret', { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check for user
    let user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Return JWT
    const token = jwt.sign({ userId: user._id }, 'jwtSecret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
}); */

