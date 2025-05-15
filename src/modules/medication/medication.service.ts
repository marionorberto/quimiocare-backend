import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMedicationDto } from './dtos/create-medication.dto';
import { UpdateMedicationDto } from './dtos/update-medication.dto';
import { DataSource, Repository } from 'typeorm';
import { Medication } from 'src/database/entities/medications/medication.entity';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
@Injectable()
export class MedicationService {
  private medicationRepository: Repository<Medication>;
  private userRepository: Repository<User>;
  constructor(
    private readonly datasource: DataSource,
    private readonly userServices: UsersService,
  ) {
    this.medicationRepository = this.datasource.getRepository(Medication);
    this.userRepository = this.datasource.getRepository(User);
  }

  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const allMedication = await this.medicationRepository
        .createQueryBuilder('medication')
        .where('medication.userId = :userId', {
          userId: idUser,
        })
        .getMany();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'medications fetched sucessfully.',
        data: [{ count: allMedication.length }, allMedication],
        path: '/medications/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch Medications | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch medications.',
          path: '/medication/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const medication = await this.medicationRepository.findOneBy({ id });

      if (!medication)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this medication.',
            path: '/medications/medication/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Medication fetched sucessfully.',
        data: medication,
        path: '/medications/medication/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this medication. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this medication.',
          error: error.message,
          path: '/medications/medication/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createMedicationDto: CreateMedicationDto, request: Request) {
    try {
      const { idUser: idUserFromRequest } = request['user'];

      const userData = await this.userRepository.findOneBy({
        id: idUserFromRequest,
      });

      const medicationToSave = this.medicationRepository.create({
        ...createMedicationDto,
        user: userData,
      });

      const medicationSaved =
        await this.medicationRepository.save(medicationToSave);

      const { id, name, dosage, note, timeReminder, createdAt } =
        medicationSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Medication created sucessfully',
        data: { id, name, dosage, note, timeReminder, createdAt },
        path: '/medications/create/medication',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Medication | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Medication',
          error: error.message,
          path: '/medications/create/medication',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    updateMedicationDto: Partial<UpdateMedicationDto>,
  ) {
    try {
      await this.medicationRepository.update(id, updateMedicationDto);

      const { name, note, dosage, timeReminder, createdAt, updatedAt } =
        await this.medicationRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Medication updated sucessfully',
        data: {
          id,
          name,
          note,
          dosage,
          timeReminder,
          createdAt,
          updatedAt,
        },
        path: '/medications/update/medication/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new Medication | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Medication',
          error: error.message,
          path: '/medications/update/medication/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const medicationToDelete = await this.medicationRepository.findOneBy({
        id,
      });
      if (!medicationToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Medication Not Found',
            path: '/medications/medication/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.medicationRepository.remove(medicationToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Medication deleted sucessfully',
        path: '/medications/delete/medication/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete Medication | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete Medication',
          error: error.message,
          path: '/medication/delete/medication/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async last(request: Request) {
    try {
      const { idUser } = request['user'];

      const [last] = await this.medicationRepository.find({
        where: {
          user: {
            id: idUser,
          },
        },
        order: { createdAt: 'DESC' },
        take: 1,
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'last me fetched sucessfully.',
        data: [last],
        path: '/medications/last',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch medications | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch medications.',
          path: '/medications/last',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
