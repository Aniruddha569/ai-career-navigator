// backend/config/db.js
// Creates a single reusable MySQL connection pool for the whole app.
// A "pool" is better than one connection because Express handles many
// requests at once — the pool hands out connections as needed and
// reuses them instead of opening a new one every time.

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick test so we fail loudly at startup if the DB is unreachable,
// instead of failing confusingly on the first request later.
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();

module.exports = pool;