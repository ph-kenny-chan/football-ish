import { Database } from '../config/Database';

const connectDB = async () => {
  await Database.getClient();
};

export default connectDB;
