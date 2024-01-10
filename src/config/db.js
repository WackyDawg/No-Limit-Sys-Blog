const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUsername = process.env.MONGODB_USERNAME;
  const mongoPassword = process.env.MONGODB_PASSWORD;
  const mongoDatabase = process.env.MONGODB_DATABASE;
  const mongoURI = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.oyimqiz.mongodb.net/${mongoDatabase}`;

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: false, // useNewUrlParser is deprecated
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
    });
    console.log('Connected to MongoDB');

    const db = mongoose.connection;

    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

module.exports = connectDB;
