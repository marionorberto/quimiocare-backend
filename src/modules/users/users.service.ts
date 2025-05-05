import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dtos/create-users.dto';
import { UpdateUsersDto } from './dtos/update-users.dto';
import * as bcryptjs from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/database/entities/users/user.entity';
import { Request } from 'express';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { EnumTypeUser } from './interfaces/interfaces';
@Injectable()
export class UsersService {
  private userRepository: Repository<User>;
  constructor(private readonly datasource: DataSource) {
    this.userRepository = this.datasource.getRepository(User);
  }

  async findAll() {
    try {
      const allUsers = await this.userRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });

      const allPacients: User[] = await this.userRepository.find({
        where: { typeUser: EnumTypeUser.paciente },
        order: {
          createdAt: 'DESC',
        },
      });

      const allDoctor: User[] = await this.userRepository.find({
        where: { typeUser: EnumTypeUser.doctor },
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Users fetched sucessfully.',
        data: [
          { count: allUsers.length },
          { allUsers: allUsers },
          { patients: allPacients },
          { doctors: allDoctor },
        ],
        path: '/users/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch users | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch users.',
          path: '/users/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(request: Request) {
    try {
      const { idUser } = request['user'];

      const user = await this.userRepository.findOneBy({ id: idUser });

      if (!user)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this user.',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'User fetched sucessfully.',
        data: user,
        path: '/users/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this user. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this user.',
          error: error.message,
          path: '/users/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createUsersDto: CreateUsersDto) {
    try {
      console.log('this is the type user:', createUsersDto.typeUser);
      const userToSave = this.userRepository.create(createUsersDto);
      const userSaved = await this.userRepository.save(userToSave);

      const { id, username, email, typeUser, createdAt } = userSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'User created sucessfully',
        data: {
          id,
          username,
          email,
          typeUser,
          password: createUsersDto.password,
          createdAt,
        },
        path: '/users/create/user',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed  to create a new User | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: `Falhou ao cadastrar usuário, ${error.message}`,
          error: error.message,
          path: '/users/create/user',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(request: Request, updateUsersDto: Partial<UpdateUsersDto>) {
    try {
      const { idUser: id } = request['user'];

      if (updateUsersDto.password) {
        const salt = await bcryptjs.genSalt(10);
        updateUsersDto.password = await bcryptjs.hash(
          updateUsersDto.password,
          salt,
        );
      }

      await this.userRepository.update(id, updateUsersDto);

      const { username, email, createdAt, updatedAt } =
        await this.userRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'User updated sucessfully',
        data: {
          id,
          username,
          email,
          createdAt,
          updatedAt,
        },
        path: '/users/update/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new User | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Não foi possível atualizar dados do usuário!',
          error: error.message,
          path: '/users/update/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const userToDelete = await this.userRepository.findOneBy({ id });
      if (!userToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Not Found',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.userRepository.remove(userToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'User deleted sucessfully',
        path: '/users/delete/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete User | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete User',
          error: error.message,
          path: '/users/delete/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(data: any) {
    try {
      const userFetched: User = await this.userRepository.findOne(data);
      if (!userFetched)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Email Not Found.',
            path: '/users/user/id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        id: userFetched.id,
        username: userFetched.username,
        password: userFetched.password,
        typeUser: userFetched.typeUser,
      };
    } catch (error) {
      console.log(`Failed to fetch User | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to fetch User',
          error: error.message,
          path: '/users/user/id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatePassword(
    request: Request,
    updatePasswordDTO: Partial<UpdatePasswordDto>,
  ) {
    try {
      const { idUser: id } = request['user'];

      const isPasswordEqual =
        updatePasswordDTO.atualPassword === updatePasswordDTO.newPassword;

      if (isPasswordEqual)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'PUT',
            message: 'Password devem ser iguais.',
            path: '/password/user/update',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      const { password: passwordFromDB } = await this.userRepository
        .createQueryBuilder('user')
        .select('user.password')
        .where('user.id = :id', { id })
        .getOne();

      if (
        !(await bcryptjs.compare(
          updatePasswordDTO.atualPassword,
          passwordFromDB,
        ))
      )
        throw new HttpException(
          {
            statusCode: 404,
            method: 'PUT',
            message: 'A atual password é inválida.',
            path: '/password/user/update',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      if (updatePasswordDTO.newPassword) {
        const salt = await bcryptjs.genSalt(10);
        updatePasswordDTO.newPassword = await bcryptjs.hash(
          updatePasswordDTO.newPassword,
          salt,
        );
      }

      await this.userRepository.update(id, {
        password: updatePasswordDTO.newPassword,
      });

      const { username, email, createdAt, updatedAt } =
        await this.userRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Password updated sucessfully',
        data: {
          id,
          username,
          email,
          createdAt,
          updatedAt,
        },
        path: '/users/update/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new password| Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Password',
          error: error.message,
          path: '/users/password/user/update',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
