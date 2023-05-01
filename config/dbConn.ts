import mongoose, { ConnectOptions } from 'mongoose';

interface CustomConnectOptions extends ConnectOptions {
  useUnifiedTopology?: boolean;
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI!, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    } as CustomConnectOptions);
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;

