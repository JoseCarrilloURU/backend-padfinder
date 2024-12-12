import pkg from 'mongoose';
const { connect, connection } = pkg;

const connectMongo = async (uri) => {
  try {
    await connect(uri);
    console.log(`Database correctly connected to ${connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectMongo;
