const express = require('express');
const app = express();
const { default: mongoose } = require('mongoose');
const { resolve } = require('path');
const dotenv=require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongodb connected"))
.catch((err)=>{console.error('Error connecting to database',err)})

const port = 3010;
app.use(express.json())
app.use(express.static('static'));
const User = require('./schema');  
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
app.post('/api/users', async (req, res) => {
  try {
      const { name, email, password, date } = req.body;
      const newUser = new User({ name, email, password, date });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
      if (error.name === 'ValidationError') {
          res.status(400).json({ message: 'Validation error', error: error.message });
      } else {
          res.status(500).json({ message: 'Server error', error: error.message });
      }
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
