import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import handlebars from 'handlebars';
import { config } from 'dotenv';
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail({
    from,
    to,
    subject,
    text,
    html,
    isHandlebars,
    templatePath,
    templateData,
  }) {
    let mailOptions = {
      from,
      to,
      subject,
    };

    if (isHandlebars && templatePath && templateData) {
      const fullTemplatePath = path.join(__dirname, templatePath);
      const templateSource = fs.readFileSync(fullTemplatePath, 'utf8');
      const compiledTemplate = handlebars.compile(templateSource);
      mailOptions.html = compiledTemplate(templateData);
    } else if (html) {
      mailOptions.html = html;
    } else if (text) {
      mailOptions.text = text;
    }

    try {
      let info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new Error('Error al enviar el correo');
    }
  }
}

export default Mailer;
