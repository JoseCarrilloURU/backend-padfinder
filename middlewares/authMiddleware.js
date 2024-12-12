import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
config();
const { JWT_SECRET } = process.env;

/**
 * Funcion Middleware para autenticar la solicitudes usando JWT token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'] || '';

  try {
    if (!token) return res.status(400).json({ msg: 'No token provided' });

    const tokenValue = token.split(' ')[1];

    jwt.verify(tokenValue, JWT_SECRET, async (error, decodedToken) => {
      if (error) return res.status(400).json({ msg: 'Invalid token' });

      const { user_id, person_id } = decodedToken;
      req.user = { person_id, user_id };

      return next();
    });
    return;
  } catch (error) {
    res.status(200).json({ msg: 'Error verifying session' });
  }
};

export default authMiddleware;
