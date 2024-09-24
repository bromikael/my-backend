// dbConfig.js
const { Pool } = require('pg');

// PostgreSQL connection settings
const pool = new Pool({
  user: 'bro',              // PostgreSQL username
  host: 'localhost',        // Database server address
  database: 'myapp_db',     // Database name
  password: 'mik',          // PostgreSQL password
  port: 5432,               // Default PostgreSQL port
});

module.exports = pool;
