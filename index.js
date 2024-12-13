const express = require('express');
const app = express()

const hostname = '127.0.0.1';
const port = 3000;
const bcrypt = require ('bcrypt')
const db_access = require('./db.js')
const db = db_access.db
app.use(express.json())

  

app.get('/users', (req, res) => {
    res.json(users);
  });
  
  app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = users.find(i => i.id === id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).send('Item not found');
    }
    });
    
  
// app.post('/users', (req, res) => {
//     const newItem = {
//         id: users.length + 1,
//         name: req.body.name 
//     };
//     users.push(newItem);
//     res.status(201).json(newItem);
// });



app.delete('/users/:id', (req, res) => {
  const usersId = req.params.id;
  const deleteUserQuery = `DELETE FROM Users WHERE id = ?`;

  db.run(deleteUserQuery, usersId, function (err) {
      if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Failed to delete user' });
      }

      res.status(200).send(`User deleted successfully`);
  });
});


app.post('/users/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  db.get(`SELECT * FROM USER (email, password) VALUES ('${email}','${password}',0)`,(err)=>{
      if(err)
      {
        console.log(err.message)
        return res.status(401).send(err)
      }
      else
      return res.status(200).send(`login successfull`)
  })
})


app.post('/users/register', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    db.run(`INSERT INTO USERS (NAME, EMAIL, PASSWORD,ISADMIN) VALUES ('${name}','${email}','${password}',0)`,(err)=>{
        if(err)
        {
          console.log(err.message)
          return res.status(401).send(err)
        }
        else
        return res.status(200).send(`Registration successfull`)
    })
})




app.post('/clothings', (req, res) => {
  const name = req.body.name
  const category = req.body.category
  const price = req.body.price
  const stock = req.body.stock
  db.run(`INSERT INTO CLOTHINGS (name, category, price, stock) VALUES ('${name}','${category}',${price},${stock})`,(err)=>{
      if(err)
      {
        console.log(err.message)
        return res.status(401).send(err)
      }
      else
      return res.status(200).send(`Clothing Uploaded Successfull`)
  })
})


// app.get('/clothings', (req, res) => {
//   const ID = req.body.ID
//   const name = req.body.name
//   const category = req.body.category

//   db.run(`SELECT * FROM CLOTHINGS (name, category, price, stock) VALUES ('${ID}',${name}','${category}')`,(err)=>{
//       if(err)
//       {
//         console.log(err.message)
//         return res.status(401).send(err)
//       }
//       else
//       return res.status(200).send(`Clothing Uploaded Successfull`)
//   })
// })

app.get('/clothings/:id', (req, res) => {
  const ID = parseInt(req.params.id);
  db.get(`SELECT * FROM clothings (ID, ISADMIN) VALUES ('${ID}',0)`,err => {
      if (err) {
          console.error(err.message);
          return res.status(500).send(err);
      }
      if (row) {
          res.status(200).json(row);
      } else {
          res.status(404).send('Clothing item not found');
      }
  });
});




app.get('/orders', (req, res) => {
  res.json(orders);
});


app.post('/orders/neworder', (req, res) => {
  const user_id = req.body.user_id
  const orders = req.body.orders
  const total = req.body.total
  db.run(`INSERT INTO ORDERS (user_id, orders, total) VALUES ('${user_id}','${orders}','${total}')`,(err)=>{
      if(err)
      {
        console.log(err.message)
        return res.status(401).send(err)
      }
      else
      return res.status(200).send(`Order Placed Successfully`)
  })
})


app.delete('/orders', (req, res) => {
  const user_id = req.body.user_id

  db.get(`DELETE FROM ORDERS (user_id) VALUES ('${user_id}')` ,(err)=>{
      if (err) 
        {
          console.log(err.message);
          return res.status(500).json({ error: 'Failed to delete user' });
        }
          else
          return res.status(200).send(`Order deleted Successfully`)
  });
});



app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
 });