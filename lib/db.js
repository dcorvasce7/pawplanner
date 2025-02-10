// lib/db.js
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Errore nella connessione al database: ', err);
    return;
  }
  console.log('Connesso al database');
});

export default db;
