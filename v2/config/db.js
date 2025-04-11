import mongoose from 'mongoose';

export const connectToMongoDB = (req, res) => {
  const { mongoUri } = req.body;
  mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));
  res.status(200).json({ message: 'MongoDB connected' });
}

export const connectLocalToMongoDB = (req, res) => {
  const LOCAL_MONGODB_URI  = process.env.LOCAL_MONGODB_URI;
  mongoose.connect(LOCAL_MONGODB_URI)
    .then(() => console.log('Connected to local database'))
    .catch((err) => console.error(err));
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.LOCAL_MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
