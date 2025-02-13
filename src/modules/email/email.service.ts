import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmailDto } from 'src/modules/email/dtos/create-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail(createEmailDto: CreateEmailDto) {
    try {
      const sentEmailInfo = await this.mailService.sendMail({
        to: createEmailDto.to,
        subject: 'Welcome',
        text: 'Welcome to Postable.',
        template: './welcome',
        context: {
          username: createEmailDto.username,
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
