import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
  ExecutionContext,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { Repository } from 'typeorm';
import { CreateMedicalInformationDto } from './dtos/create-medication-information.dto';
import { Request } from 'express';
import { UpdateMedicalInformationDto } from './dtos/update-medication-information.dto';
import { UsersService } from '../users/users.service';
import { MedicalInformation } from 'src/database/entities/user-medical-information/medical-information.entity';
import { User } from 'src/database/entities/users/user.entity';
@UseGuards(AuthGuard)
@Injectable()
export class MedicalInformationService {
  private context: ExecutionContext;
  constructor(
    @InjectRepository(MedicalInformation)
    private readonly medicalInformationRepository: Repository<MedicalInformation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userServices: UsersService,
  ) {}
  async findAll(request: Request) {
    try {
      const { idUserFromRequest } = request['user'];

      const allMedicalInformations =
        await this.medicalInformationRepository.find({
          order: {
            createdAt: 'DESC',
          },
          where: {
            user: idUserFromRequest,
          },
          relations: {
            user: true,
          },
        });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'all medical-information fetched sucessfully.',
        data: [
          { count: allMedicalInformations.length },
          allMedicalInformations,
        ],
        path: '/symptoms/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch medical-information | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch medical-information.',
          path: '/medical-information/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createMedicalInformationDto: CreateMedicalInformationDto) {
    try {
      const [lastUserCreated] = await this.userRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });

      if (!lastUserCreated) {
        throw new Error(
          'Nenhum usuário encontrado para salvar as informações médicas.',
        );
      }

      const informationToSave = this.medicalInformationRepository.create({
        ...createMedicalInformationDto,
        user: lastUserCreated,
      });
      const informationSaved =
        await this.medicalInformationRepository.save(informationToSave);

      const {
        id,
        codHospital,
        bloodGroup,
        height,
        weight,
        hospital,
        stage,
        targetSupport,
        user,
        createdAt,
      } = informationSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'medical-information created sucessfully',
        data: {
          id,
          codHospital,
          bloodGroup,
          height,
          weight,
          hospital,
          stage,
          targetSupport,
          user,
          createdAt,
        },
        path: '/medical-informations/create/medical-information',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new medical-information  | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new medical-information',
          error: error.message,
          path: '/medical-informations/create/information',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(request: Request) {
    try {
      const { idUser } = request['user'];
      const idToString = String(idUser);

      const [information] = await this.medicalInformationRepository.query(
        `SELECT * FROM Users_Medical_Information where userId='${idToString}'`,
      );

      // const information = await this.medicalInformationRepository.findOneBy({
      //   id: idUser,
      // });

      // if (!information)
      //   throw new HttpException(
      //     {
      //       statusCode: 404,
      //       method: 'GET',
      //       message: 'Failure to fetch this information.',
      //       path: '/medical-information/information/:id',
      //       timestamp: Date.now(),
      //     },
      //     HttpStatus.NOT_FOUND,
      //   );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'medical information fetched sucessfully.',
        data: information,
        path: '/medical-information/information/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this medical-information. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this medial-information.',
          error: error.message,
          path: '/medical-information/information/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateOne(
    id: string,
    updateMedicalInformationDto: Partial<UpdateMedicalInformationDto>,
  ) {
    try {
      await this.medicalInformationRepository.update(
        id,
        updateMedicalInformationDto,
      );

      const {
        id: idInformation,
        codHospital,
        hospital,
        bloodGroup,
        height,
        weight,
        stage,
        targetSupport,
        createdAt,
        updatedAt,
      } = await this.medicalInformationRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'medical-informations updated sucessfully',
        data: {
          id: idInformation,
          codHospital,
          hospital,
          bloodGroup,
          height,
          weight,
          stage,
          targetSupport,
          createdAt,
          updatedAt,
        },
        path: '/medical-information/update/information/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new medical-informations | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Symptom',
          error: error.message,
          path: '/medical-informations/update/information/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const informationToDelete =
        await this.medicalInformationRepository.findOneBy({ id });
      if (!informationToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'information Not Found',
            path: '/medical-informations/information/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.medicalInformationRepository.remove(informationToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'medical-information deleted sucessfully',
        path: '/medical-informations/delete/medical-information/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete medical-information | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete medical-information',
          error: error.message,
          path: '/medical-informations/delete/medical-information/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
