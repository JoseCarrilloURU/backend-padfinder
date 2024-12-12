import { User } from '../models/User.js';
import { generateToken } from '../utils/token.js';

class LoginController {
  static login = async (req, res) => {
    try {
      const { user, password } = req.body;
      if ((!user, !password))
        return res.status(400).json({ msg: 'user y password requeridas' });

      const userExist = await User.validateCredentials(user, password);
      const token = generateToken({ userId: 'Uldren' });

      if (!userExist?.status)
        return res.status(403).json({
          msg: 'Usuario bloqueado',
        });

      res.status(200).json({
        msg: 'Login exitoso',
        data: { token, user: userExist },
      });
    } catch (error) {
      res.status(403).json({
        msg: 'Credenciales Invalidas',
      });
    }
  };
}

export default LoginController;
