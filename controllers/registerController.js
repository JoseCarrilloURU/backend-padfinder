import { User } from '../models/User.js';

class RegisterController {
  static register = async (req, res) => {
    try {
      const {
        username,
        password,
        name,
        lastname,
        email,
        genre,
        experience,
        preferred_genre,
      } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({ msg: 'Faltan datos del usuario' });
      }

      const image = req.file
        ? { data: req.file.buffer, contentType: req.file.mimetype }
        : undefined;

      const result = await User.createPersonAndUser({
        username,
        password,
        name,
        lastname,
        email,
        genre,
        experience,
        preferred_genre,
        image,
      });

      const { data, msg } = result;

      res.status(201).json({
        msg,
        data,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al crear usuario',
        error: error.message,
      });
    }
  };
}

export default RegisterController;
