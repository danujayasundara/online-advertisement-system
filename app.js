//import env
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
console.log('JWT Secret:', process.env.JWT_SECRET);

//accept requests from different domains
const cors = require('cors');

//pass request bodies
const bodyParser = require('body-parser');

//import express
const express = require("express");

//import mysql
const mysql =  require("mysql2");

const sequelize = require('./config/database');

//import route for login
const authRoutes =  require('./routes/authRoutes');

//middleware for login
const authenticate = require('./middleware/authMiddleware');

//import route for add ad
const adRoutes = require('./routes/adRoutes'); 

//import route for profile
const profileRoutes = require('./routes/profileRoutes'); 

//import models
const { City, Category, Seller, Advertisement, Image } = require('./models');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

//db connection
sequelize.sync({force: false}).then(() => {  // sync method is used to create the corresponding database tables -- force=true, will drop all existing tables -- force=false not drop existing tables.only create tables do not exist
    console.log('Database Connected');
}).catch((error) => {
    console.error('Database connection failed:', error);
});

const secret = process.env.JWT_SECRET;

//Define routes
//app.use('/', require('./routes/pages'));
app.use('/auth', authRoutes);
app.use('/ads', adRoutes);
app.use('/seller', profileRoutes);

/*app.get('/home', authenticate, (req, res) => {
    res.send(`Welcome user ${req.userId}`);
})*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });