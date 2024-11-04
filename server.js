const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const userRouter = require('./src/routes/userRouter');
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(cors());

const port = 3000;
const Host = 'localhost';

app.use(morgan('dev'));

//content type
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.static('public/uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.use('/api/users', userRouter);




app.listen(port, Host, () => {
  console.log(`Server is running on port ${port}`);
});