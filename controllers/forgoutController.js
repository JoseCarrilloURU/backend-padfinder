import codeChecker from '../components/CodeChecker/index.js';
import { User } from '../models/User.js';
import Mailer from '../components/Mailer/Mailer.js';
import { generateToken, decodeToken } from '../utils/token.js';
import { config } from 'dotenv';
config();

const { SMTP_USER } = process.env;

class ForgoutController {
  static forgoutPassword = async (req, res) => {
    try {
      const mailer = new Mailer();
      const { email } = req.body;
      const userExist = await User.findByEmail(email);
      if (!userExist)
        return res.status(403).json({
          msg: 'El correo no tiene un usuario asociado',
        });

      const randomCode = codeChecker.generateCode(6);
      codeChecker.addCode(userExist._id, randomCode);

      const token = generateToken({ userId: userExist._id }, '10m');

      const isSend = await mailer.sendMail({
        from: SMTP_USER,
        to: email,
        subject: 'Codigo de Verificacion',
        isHandlebars: true,
        templatePath: '../../config/mails/forgout_template.html',
        templateData: { code: randomCode },
      });

      if (isSend.accepted.length < 1) {
        codeChecker.deleteCode(userExist._id);
        return res.status(500).json({
          msg: 'Hubo un error al enviar el correo',
        });
      }

      res.status(200).json({
        msg: 'Un codigo ha sido enviado a su correo',
        data: {
          token,
        },
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Ocurrio un error al enviar codigo',
        error: error.message,
      });
    }
  };

  static verifyCode = (req, res) => {
    try {
      const { token } = req.params;
      const { code } = req.body;

      if (!token || !code)
        return res.status(400).json({
          msg: 'El codigo es requerido al igual que el token',
        });

      const tokenData = decodeToken(token);
      const { userId } = tokenData;

      const oldCode = codeChecker.getCode(userId);

      if (!oldCode)
        return res.status(403).json({
          msg: 'Token invalido',
        });

      if (Number(code) !== Number(oldCode))
        return res.status(403).json({
          msg: 'Codigo invalido',
        });

      const newToken = generateToken(
        {
          isChange: true,
          userId,
        },
        '3m',
      );

      codeChecker.deleteCode(userId);
      res.status(200).json({
        msg: 'Codigo correcto',
        data: {
          token: newToken,
        },
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al verificar codigo',
        error: error.message,
      });
    }
  };

  static changePassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!token)
        return res.status(403).json({
          msg: 'El token es requerido',
        });

      if (!password)
        return res.status(400).json({
          msg: 'La nueva contraseña es requerida',
        });

      const tokenData = decodeToken(token);
      const { userId, isChange } = tokenData;
      if (!isChange)
        return res.status(403).json({
          msg: 'No tiene permisos para cambiar la contraseña',
        });

      const newUser = await User.findByIdAndUpdate(userId, {
        password,
      });
      if (!newUser)
        return res.status(400).json({
          msg: 'Error al actualizar contraseña',
        });

      res.status(200).json({
        msg: 'Contraseña actualizada con exito',
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al cambiar contraseña',
        error: error.message,
      });
    }
  };
}

export default ForgoutController;
