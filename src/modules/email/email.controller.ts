import { Body, Controller, Post } from '@nestjs/common';
import { CreateEmailDto } from './dtos/create-email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Post('send')
  async sendMailer(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.sendEmail(createEmailDto);
  }
}
