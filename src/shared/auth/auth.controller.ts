import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/database/entities/users/user.entity';
import { EmailService } from 'src/modules/email/email.service';

@Controller('auth')
export class AuthController {
  private userRepository: Repository<User>;
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
    private readonly datasource: DataSource,
    private readonly mailService: EmailService,
  ) {
    this.userRepository = this.datasource.getRepository(User);
  }

  // : Promise<{ acess_token: string }>
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const token = crypto.randomBytes(32).toString('hex'); // Gerar token único
    console.log('this is - ', token);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Expira em 1h
    await this.userRepository.save(user);

    // Enviar e-mail com o link de redefinição
    await this.mailService.sendEmail({
      to: user.email,
      username: user.username,
      token,
    });

    return { message: 'E-mail de recuperação enviado com sucesso' };
  }
}
