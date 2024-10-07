import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import * as path from 'path';
import fs from 'fs';
import {
  IEmailService,
  SendMailOptions,
} from './interfaces/email-service.interface';
import { GoogleAuthService } from '../google-auth/google-auth.service';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  async sendMail(options: SendMailOptions): Promise<void> {
    const CLIENT_EMAIL = process.env.GMAIL_EMAIL_FROM;
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

    try {
      // Obtém as credenciais do GoogleAuthService
      const { accessToken, refreshToken } =
        await this.googleAuthService.getCredentials();

      // Cria o transporte de e-mail
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: CLIENT_EMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          accessToken,
          refreshToken,
        },
      });

      // Compila o template usando o Handlebars diretamente
      const templatePath = path.join(
        __dirname,
        'templates',
        `${options.template}.hbs`,
      );
      const source = fs.readFileSync(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(source);
      const html = compiledTemplate(options.context);

      const mailOptions = {
        from: `Jogo IBUC <${CLIENT_EMAIL}>`,
        to: options.to,
        replyTo: process.env.EMAIL_REPLY_TO || CLIENT_EMAIL,
        subject: options.subject || '(1) Você tem uma nova mensagem.',
        html: html,
      };

      await transport.sendMail(mailOptions);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }
}
