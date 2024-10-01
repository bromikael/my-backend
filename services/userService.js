const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../dbConfig');

const registerUser = async (email, password) => {
  const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('User already exists');
  }

  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, hashedPassword]
  );

  return newUser.rows[0];
};

const loginUser = async (email, password) => {
  const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userCheck.rows.length === 0) {
    throw new Error('User does not exist');
  }

  const user = userCheck.rows[0];
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('Invalid password');
  }

  return user;
};

const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId }, // Payload
    process.env.JWT_SECRET,
    { expiresIn: '1h' } 
  );
};

module.exports = {
  registerUser,
  loginUser,
  generateToken,
};
