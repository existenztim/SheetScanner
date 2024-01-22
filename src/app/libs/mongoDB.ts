import mongoose from 'mongoose';
const connectMongoDB = async () => {
  try {
    const mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri) {
      console.error('MONGODB_URI is not defined in the environment variables.');
      return;
    }

    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error(error);
  }
};

export default connectMongoDB;
