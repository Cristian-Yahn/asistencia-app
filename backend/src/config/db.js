const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const db = new Database(path.resolve(__dirname, '../../', process.env.DB_PATH));
db.pragma('foreign_keys = ON'); // SQLite no las activa por defecto

module.exports = db;