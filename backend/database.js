const mysql = require('mysql2/promise');

// Railway provides MYSQL_URL, locally we fall back to the JSON file approach
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10
});

// Create tables if they don't exist
async function init() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      email      VARCHAR(255) NOT NULL UNIQUE,
      deals      TINYINT(1) DEFAULT 1,
      articles   TINYINT(1) DEFAULT 1,
      refurb     TINYINT(1) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      email      VARCHAR(255) NOT NULL,
      subject    VARCHAR(255),
      message    TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      description TEXT,
      price       DECIMAL(10,2) NOT NULL,
      category    VARCHAR(100),
      image_url   TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('  ✅  Database tables ready.');
}

module.exports = { pool, init };
