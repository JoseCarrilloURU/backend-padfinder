import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();
import { importJSON } from './importJSON.js';

const jwtConfig = importJSON('../config/config.json');

const { JWT_SECRET } = process.env;

export const generateToken = (data, expiresIn = null) => {
  const config = {
    expiresIn,
  };

  return jwt.sign(data, JWT_SECRET, expiresIn ? config : jwtConfig.JWT);
};

export const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
