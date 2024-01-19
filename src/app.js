const express = require('express')
const mongoose = require('mongoose');
const connectDB = require('./config/db')
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const flash = require('express-flash');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const MongoStore = require('connect-mongo')
const categoryRoutes = require('./routes/categoryRoutes');
const homeRoutes = require('./routes/homeRoutes');
const blogRoutes = require('./routes/blogRoutes');
const tagRoutes = require('./routes/tagRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');
const setupRoutes = require('./routes/installRoutes')
const uploadRoutes = require('./routes/uploadRoutes');
const setupCheckMiddleware = require('./middleware/setupCheck');
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const verifyToken = require('./middleware/authMiddleware')



const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
//app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');
const setupLayout = 'layouts/setup';
app.use(flash());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
   
}))

app.use(expressLayout);

app.use(express.static('public'))
app.use(cookieParser());
//app.use(verifyToken);
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     next();
//   });

app.use('/', homeRoutes);
app.use('/admin', adminRoutes)
app.use('/', setupRoutes);
app.use('/', uploadRoutes);

app.use('/categories', categoryRoutes);
app.use('/tag', tagRoutes);
app.use('/', searchRoutes);
app.use('/articles', blogRoutes);


app.listen(PORT, (req, res) => {
    console.log(`app running on Port ${PORT}`)
})