const express = require('express');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const db_access = require('./db.js');
const db = db_access.db;
const hostname = '127.0.0.1';
const port = 3000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());


app.get('/user', (req, res) => {
    const sql = 'SELECT * FROM user';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200).json({
            message: 'success',
            data: rows
        });
    });
});



app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM user WHERE ID = ?`;

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(200).json({
                message: 'User found',
                data: row
            });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    });
});


app.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    const deleteUserQuery = `DELETE FROM User WHERE id = ?`;

    db.run(deleteUserQuery, [id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to delete user' });
        }
        res.status(200).send('User deleted successfully');
    });
});



app.post('/user/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sql = 'SELECT * FROM user WHERE EMAIL = ?';

    db.get(sql, [email], (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Database error');
        }
        if (!user || !bcrypt.compareSync(password, user.PASSWORD)) {
            return res.status(401).send('Invalid email or password');
        }

        return res.status(200).json({
            message: 'Login successful'
        });
    });
});



app.post('/user/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.log(err.message);
            return res.status(500).send('Internal Server Error');
        }


        const sql = `INSERT INTO USER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, 0)`;
        db.run(sql, [name, email, hashedPassword], (err) => {
            if (err) {
                console.log(err.message);
                return res.status(401).send('Registration failed');
            } else {
                return res.status(200).send('Registration successful');
            }
        });
    });
});


app.post('/clothings', (req, res) => {
    const name = req.body.name;
    const category = req.body.category;
    const price = req.body.price;
    const stock = req.body.stock;
    db.run(`INSERT INTO CLOTHINGS (name, category, price, stock) VALUES ('${name}','${category}',${price},${stock})`, (err) => {
        if (err) {
            console.log(err.message);
            return res.status(401).send(err);
        } else {
            return res.status(200).send('Clothing Uploaded Successfully');
        }
    });
});




app.get('/clothings', (req, res) => {
    const sql = 'SELECT * FROM clothings';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200).json({
            message: 'success',
            data: rows
        });
    });
});




app.get('/clothings/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const sql = 'SELECT * FROM clothings WHERE ID = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
        if (row) {
            return res.status(200).json(row);
        } else {
            return res.status(404).send('Clothing item not found');
        }
    });
});




app.post('/orders/neworder', (req, res) => {
    const user_id = req.body.users_id;
    const orders = req.body.orders;
    const total = req.body.total;
    db.run(`INSERT INTO ORDERS (user_id, orders, total) VALUES ('${user_id}','${orders}','${total}')`, (err) => {
        if (err) {
            console.log(err.message);
            return res.status(401).send(err);
        } else {
            return res.status(200).send('Order Placed Successfully');
        }
    });
});




app.delete('/orders', (req, res) => {
    const user_id = req.body.user_id;

    db.get(`DELETE FROM ORDERS (user_id) VALUES ('${user_id}')`, (err) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: 'Failed to delete order' });
        } else {
            return res.status(200).send('Order deleted Successfully');
        }
    });
});




app.post('/review/addreview', (req, res) => {
    const name = req.body.name;
    const review = req.body.review;
    const userId = req.body.user_id;

    const sql = `INSERT INTO review (USER_ID, NAME, REVIEW) VALUES (?, ?, ?)`;
    db.run(sql, [userId, name, review], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to add review' });
        }

        res.status(200).send(`Review added successfully with ID ${this.lastID}`);
    });
});



app.delete('/review/deletereview/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM review WHERE ID = ?`;
    db.run(sql, id, function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to delete review' });
        }
        if (this.changes === 0) {
            return res.status(404).send('Review not found');
        }
        res.status(200).send('Review deleted successfully');
    });
});




app.post('/cart/addtocart', (req, res) => {
  const userId = req.body.user_id;
  const productId = req.body.product_id;
  const quantity = req.body.quantity;

  const sql = `INSERT INTO cart (USER_ID, PRODUCT_ID, QUANTITY) VALUES (?, ?, ?)`;
  db.run(sql, [userId, productId, quantity], function (err) {
      if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Failed to add item to cart' });
      }

      res.status(200).send(`Item added to cart successfully`);
  });
});





app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
