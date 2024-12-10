const sqlite = require('sqlite3');
const db = new sqlite.Database('database.db');


const createusersTable = `CREATE TABLE IF NOT EXISTS users (
ID INTEGER PRIMARY KEY AUTOINCREMENT,
EMAIL TEXT UNIQUE NOT NULL,
NAME TEXT NOT NULL,
PASSWORD TEXT NOT NULL,
ISADMIN INTEGER NOT NULL)`;
 


const createclothingstable =`CREATE TABLE IF NOT EXISTS clothings (
ID INTEGER PRIMARY KEY AUTOINCREMENT,
NAME TEXT NOT NULL,
CATEGORY TEXT,
PRICE INTEGER NOT NULL,
STOCK INTEGER NOT NULL,
ISADMIN INTEGER NOT NULL)`;



const createProductstable =`CREATE TABLE IF NOT EXISTS products (
ID INTEGER PRIMARY KEY AUTOINCREMENT,
NAME TEXT NOT NULL,
DESCRIPTION TEXT,
PRICE REAL NOT NULL,
STOCK INTEGER NOT NULL)`;



const createorderstable =`CREATE TABLE IF NOT EXISTS orders (
ID INTEGER PRIMARY KEY AUTOINCREMENT,
USER_ID TEXT NOT NULL,
ORDERS TEXT,
TOTAL REAL NOT NULL)`;



db.serialize(() => {
    db.run(createusersTable, (err) => {
        if (err) {
            return console.error("Error creating Users table:", err.message);
        }
        console.log("Users table created successfully.");
    });

    db.run(createclothingstable, (err) => {
        if (err) {
            return console.error("Error creating Clothings table:", err.message);
        }
        console.log("Clothings table created successfully.");
    });

    db.run(createProductstable, (err) => {
        if (err) {
            return console.error("Error creating Products table:", err.message);
        }
        console.log("Products table created successfully.");
    });

    db.run(createorderstable, (err) => {
        if (err) {
            return console.error("Error creating orders table:", err.message);
        }
        console.log("Orders table created successfully.");
    });
});

module.exports={db,createusersTable, createProductstable, createorderstable, createclothingstable}