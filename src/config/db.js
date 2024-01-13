const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUsername = process.env.MONGODB_USERNAME;
  const mongoPassword = process.env.MONGODB_PASSWORD;
  const mongoDatabase = process.env.MONGODB_DATABASE;
  const mongoURI = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.oyimqiz.mongodb.net/${mongoDatabase}`;

  try {
    const connectionOptions = {
      useNewUrlParser: false, // useNewUrlParser is deprecated
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
    };

    const connection = await mongoose.connect(mongoURI, connectionOptions);
    console.log('Connected to MongoDB');

    // Fetch MongoDB version
    const client = mongoose.connection.getClient(); // Get the underlying MongoDB driver client
    const adminDb = client.db().admin();
    const mongoVersion = await adminDb.serverInfo();
    const versionString = mongoVersion.version;
    //console.log(mongoVersion);

    return {
      db: connection.connection,
      mongoVersion: versionString,
    };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

module.exports = connectDB;
