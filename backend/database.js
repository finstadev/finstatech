// Simple JSON file database — no native modules needed
const fs   = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'finstatech.json');

// Default empty database structure
const DEFAULT = {
  subscribers: [],
  contacts:    [],
  products:    []
};

// Load the database from disk (or create it fresh)
function load() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT, null, 2));
    return JSON.parse(JSON.stringify(DEFAULT));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

// Save the database back to disk
function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Generate an auto-increment id for a collection
function nextId(collection) {
  if (collection.length === 0) return 1;
  return Math.max(...collection.map(r => r.id)) + 1;
}

module.exports = { load, save, nextId };
