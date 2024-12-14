const sqlite = require('sqlite3');
const db = new sqlite.Database('database.db');


const createuserTable = `CREATE TABLE IF NOT EXISTS users (
ID INTEGER PRIMARY KEY AUTOINCREMENT,
EMAIL TEXT UNIQUE NOT NULL,
NAME TEXT NOT NULL,
PASSWORD TEXT NOT NULL,
ISADMIN INTEGER NOT NULL DEFAULT 0)`;
 


const createclothingstable =`CREATE TABLE IF NOT EXISTS clothings (
ID INTEGER PRIMARY KEY AUTOINCREMENT,
NAME TEXT NOT NULL,
CATEGORY TEXT,
PRICE INTEGER NOT NULL,
STOCK INTEGER NOT NULL,)`;



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


const createreviewtable = `CREATE TABLE IF NOT EXISTS review (
ID INTEGER PRIMARY KEY AUTOINCREMENT,
USER_ID TEXT NOT NULL,
NAME TEXT,
REVIEW TEXT NOT NULL)`;


const createCartTable = `CREATE TABLE IF NOT EXISTS cart ( 
ID INTEGER PRIMARY KEY AUTOINCREMENT, 
USER_ID INTEGER NOT NULL, 
PRODUCT_ID INTEGER NOT NULL, 
QUANTITY INTEGER NOT NULL, 
FOREIGN KEY(USER_ID) REFERENCES users(ID), 
FOREIGN KEY(PRODUCT_ID) REFERENCES products(ID) )`;

    

db.serialize(() => {
    db.run(createuserTable, (err) => {
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


    db.run(createorderstable, (err) => {
        if (err) {
            return console.error("Error creating orders table:", err.message);
        }
        console.log("Orders table created successfully.");
    });

    db.run(createreviewtable, (err) => {
        if (err) {
            return console.error("Error creating review table:", err.message);
        }
        console.log("review table created successfully.");
    });


    db.run(createCartTable, (err) => {
        if (err) {
            return console.error("Error creating Clothings table:", err.message);
        }
        console.log("Clothings table created successfully.");
    });
});

module.exports={db,createuserTable, createorderstable, createclothingstable,createreviewtable,createCartTable}