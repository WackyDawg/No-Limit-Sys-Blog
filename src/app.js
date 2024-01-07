const express = require('express')
const mongoose = require('mongoose');
const connectDB = require('./config/db')
const categoryRoutes = require('./routes/categoryRoutes');
const homeRoutes = require('./routes/homeRoutes');
const blogRoutes = require('./routes/blogRoutes');
const tagRoutes = require('./routes/tagRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser');




const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
//app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');

app.use(expressLayout);

app.use(express.static('public'))

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
  });
  

app.get('/', homeRoutes);
app.use('/', adminRoutes)

app.use('/categories', categoryRoutes);
app.use('/', tagRoutes);
app.use('/', searchRoutes);
app.use('/articles', blogRoutes);


app.listen(PORT, (req, res) => {
    console.log(`app running on Port ${PORT}`)
})