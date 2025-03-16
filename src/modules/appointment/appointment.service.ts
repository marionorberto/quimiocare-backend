import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { Request } from 'express';
import { DataSource, Repository } from 'typeorm';
import { Appointment } from 'src/database/entities/appointment/appointment.entity';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
@Injectable()
export class AppointmentsService {
  private appointmentRepository: Repository<Appointment>;
  private userRepository: Repository<User>;
  constructor(
    private readonly datasource: DataSource,
    private readonly userServices: UsersService,
  ) {
    this.appointmentRepository = this.datasource.getRepository(Appointment);
    this.userRepository = this.datasource.getRepository(User);
  }

  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const allAppointment = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.userId = :userId', {
          userId: idUser,
        })
        .getMany();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'appointments fetched sucessfully.',
        data: [{ count: allAppointment.length }, allAppointment],
        path: '/appointments/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch appointments | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch appointments.',
          path: '/appointments/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id });

      if (!appointment)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this appointmet.',
            path: '/appointments/appointment/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Appointment fetched sucessfully.',
        data: appointment,
        path: '/appointments/appointment/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this appointment. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this appointment.',
          error: error.message,
          path: '/appointment/appointment/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createAppointmentDto: CreateAppointmentDto, request: Request) {
    try {
      const { idUser } = request['user'];

      const userData = await this.userRepository.findOneBy({
        id: idUser,
      });

      const appointmentToSave = this.appointmentRepository.create({
        ...createAppointmentDto,
        user: userData,
      });

      const appointmentSaved =
        await this.appointmentRepository.save(appointmentToSave);

      const {
        id,
        name,
        description,
        type,
        note,
        dateAppointment,
        statusAppointment,
        createdAt,
      } = appointmentSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'appointment created sucessfully',
        data: {
          id,
          name,
          description,
          type,
          note,
          dateAppointment,
          statusAppointment,
          createdAt,
        },
        path: '/appointments/create/appointment',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new appointment | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new appointment',
          error: error.message,
          path: '/appointments/create/appointment',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    updateAppointmentDto: Partial<UpdateAppointmentDto>,
  ) {
    try {
      await this.appointmentRepository.update(id, updateAppointmentDto);

      const { createdAt, updatedAt } =
        await this.appointmentRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'appointment updated sucessfully',
        data: {
          id,
          createdAt,
          updatedAt,
        },
        path: '/appointments/update/appointment/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new appointment | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update appointment',
          error: error.message,
          path: '/appointments/update/appointment/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const appointmentToDelete = await this.appointmentRepository.findOneBy({
        id,
      });
      if (!appointmentToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'appointment Not Found',
            path: '/appointments/appointment/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.appointmentRepository.remove(appointmentToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'appointment deleted sucessfully',
        path: '/appointments/delete/appointment/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete appointment | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete appointment',
          error: error.message,
          path: '/appointments/delete/appointment/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
