import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail({ to, username, token }) {
    try {
      const sentEmailInfo = await this.mailService.sendMail({
        to: to,
        subject: 'QUIMIOCARE',
        text: 'Recuperação de senha.',
        template: './welcome',
        context: {
          username,
          token,
        },
      });

      return {
        statusCode: 201,
        method: 'POST',
        message: 'email sent sucessfully',
        data: sentEmailInfo,
        path: '/send/email',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to send email | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to sent email',
          error: error.message,
          path: '/send/email',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async send(email: string, username: string, token: string) {
    try {
      const sentEmailInfo = await this.mailService.sendMail({
        to: email,
        subject: 'Welcome',
        text: 'Welcome to Postable.',
        template: './welcome.hbs',
        context: {
          username,
          token,
        },
      });

      return {
        statusCode: 201,
        method: 'POST',
        message: 'email sent sucessfully',
        data: sentEmailInfo,
        path: '/send/email',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to send email | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to sent email',
          error: error.message,
          path: '/send/email',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
