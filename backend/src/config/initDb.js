const fs = require('fs');
const path = require('path');
const db = require('./db');

const schema = fs.readFileSync(path.resolve(__dirname, '../../database/schema.sql'), 'utf8');
db.exec(schema);
console.log('Tablas creadas correctamente');