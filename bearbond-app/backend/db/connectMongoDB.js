import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connect.connection.host}`);

  } catch (err) {
    console.log(`Error: connection to mongoDB: ${err.message}`);
    process.exit(1)
  }
}

export default connectMongoDB;