const mongoose = require('mongoose');


const connectDB = async () => {
    mongoose.Promise = global.Promise;
    try {
        mongoose.set('strictQuery', false);
       const conn = await mongoose.connect('mongodb+srv://julian1234:password2005@cluster0.oyimqiz.mongodb.net/blog');
       console.log('connected successfully')
    } catch (error) {
       console.log(error)
    }
}

module.exports = connectDB;