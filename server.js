const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
require('dotenv').config();


const port = 3000;
const Host = 'localhost';

app.use(morgan('dev'));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, Host, () => {
  console.log(`Server is running on port ${port}`);
});