import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from 'src/modules/users/users.service';
import { SignInDto } from './dtos/sign-in.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/database/entities/users/user.entity';

@Injectable()
export class AuthService {
  private userRepository: Repository<User>;
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly datasource: DataSource,
  ) {
    this.userRepository = this.datasource.getRepository(User);
  }

  async signIn(signInDto: SignInDto): Promise<{
    acess_token: string;
    typeUser: string;
    username: string;
    idUser: string;
  }> {
    try {
      const userData = await this.usersService.findOne({
        where: {
          email: signInDto.email,
        },
      });

      if (!userData.id) {
        throw new HttpException(
          {
            statusCode: 401,
            method: 'POST',
            message: 'Email não encontrado.',
            path: '/auth/login',
            timestamp: Date.now(),
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await this.validatePassword(
        signInDto.password,
        userData.password,
      );

      if (!isPasswordValid)
        throw new HttpException(
          {
            statusCode: 401,
            method: 'POST',
            message: 'password inválida.',
            path: '/auth/login',
            timestamp: Date.now(),
          },
          HttpStatus.UNAUTHORIZED,
        );

      const payloads = {
        idUser: userData.id,
        username: userData.username,
        typeUser: userData.typeUser,
      };

      return {
        acess_token: await this.jwtService.signAsync(payloads),
        typeUser: userData.typeUser,
        username: userData.username,
        idUser: userData.id,
      };
    } catch (error) {
      console.log(
        `Failed to authenticate User | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 401,
          method: 'POST',
          message: error.response.message,
          error: error.message,
          path: '/auth/login',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcryptjs.compare(plainPassword, hashedPassword);
  }
}
