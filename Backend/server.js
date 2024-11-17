const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const userRouter = require('./src/routes/userRouter');
const courseRouter = require('./src/routes/CourseRouter');
const moduleRouter = require('./src/routes/ModuleRouter');
const lessonRouter = require('./src/routes/LessonRouter');
const enrollmentRouter = require('./src/routes/enrollment');
const app = express();
require('dotenv').config();
const cors = require('cors');
const passportRouter = require('./src/routes/auth');
const passport = require('passport');
require('./src/config/passport-google');
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(cookieParser());
app.use(cors());

const port = 3000;
const Host = 'localhost';

app.use(morgan('dev'));

//content type
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.static(path.join(__dirname, '../public')));

app.use("/public/uploads", express.static("public/uploads"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//routes
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/modules', moduleRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/auth', passportRouter);
// Add these middleware
app.use(passport.initialize());

// Add the auth routes


app.listen(port, Host, () => {
  console.log(`Server is running on port ${port}`);
});