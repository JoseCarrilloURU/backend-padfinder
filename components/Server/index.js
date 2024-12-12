import { config } from 'dotenv';
import Server from './Server.js';

config();
const { PORT } = process.env;

export default new Server({
  portDefault: PORT,
});
