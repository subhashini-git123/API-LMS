import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false, // use true for port 465, false for 587
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"No Reply" <${this.configService.get('MAIL_USER')}>`,
        to,
        subject,
        text,
      });
      this.logger.log(`✅ Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const message = `Hello,\n\nClick the link below to reset your password:\n${resetLink}\n\nIf you did not request this, please ignore this email.`;
    return this.sendMail(email, 'Password Reset Request', message);
  }
}
