import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/database/entities/profiles/user-profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { User } from 'src/database/entities/users/user.entity';
import { TagsService } from 'src/modules/tags/tags.service';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { CreateProfileDoctorDto } from './dtos/create-profile-doctor.dto';
import { ProfileDoctor } from 'src/database/entities/profiles-doctor/user-profile-doctor.entity';
import { CreateSuggestYTDto } from './dtos/create-suggest.dto ';
import { suggestVideo } from 'src/database/entities/suggest/suggest.entity';
import { Daily } from 'src/database/entities/daily/daily.entity';
import { Medication } from 'src/database/entities/medications/medication.entity';
import { Appointment } from 'src/database/entities/appointment/appointment.entity';
import { Symptom } from 'src/database/entities/symptoms/symptom.entity';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    @InjectRepository(ProfileDoctor)
    private readonly profileDoctorRepository: Repository<ProfileDoctor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(suggestVideo)
    private readonly suggestVideoRepo: Repository<suggestVideo>,
    private readonly tagsService: TagsService,
    private readonly userService: UsersService,
    @InjectRepository(Daily)
    private readonly dailyRepository: Repository<Daily>,
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Symptom)
    private readonly symptomRepository: Repository<Symptom>,
  ) {}

  async findAll() {
    try {
      const allProfiles = await this.profilesRepository.find({
        relations: {
          user: true,
          tags: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'profiles fetched sucessfully.',
        data: [{ count: allProfiles }, allProfiles],
        path: '/profiles',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch profiles | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch profiles.',
          path: '/profiles/all',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createProfileDto: CreateProfileDto) {
    try {
      const [lastUserCreated] = await this.userRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });

      if (!lastUserCreated) {
        throw new Error('Nenhum usuário encontrado para criar perfil.');
      }

      const existingTags = await Promise.all(
        createProfileDto.tags.map(async (element) => {
          return await this.tagsService.findOne(element.description);
        }),
      );

      const hasFalsyValue = existingTags.some((element) => !element);

      if (hasFalsyValue) {
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Tags Not Found.',
            path: '/tags/tag/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const profileToSave = this.profilesRepository.create({
        ...createProfileDto,
        user: lastUserCreated,
        tags: existingTags,
      });

      const profileSaved = await this.profilesRepository.save(profileToSave);

      const { id, user, bio, birthday, urlImg, tags, createdAt } = profileSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Profile created sucessfully',
        data: {
          id,
          user,
          bio,
          birthday,
          urlImg,
          tags,
          createdAt,
        },
        path: '/profiles/create/profile',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Profile | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Profile',
          error: error.message,
          path: '/profiles/create/profile',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createDoctor(createProfileDoctorDto: CreateProfileDoctorDto) {
    try {
      const [lastUserCreated] = await this.userRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });

      if (!lastUserCreated) {
        throw new Error('Nenhum usuário encontrado para criar perfil.');
      }

      const profileToSave = this.profileDoctorRepository.create({
        ...createProfileDoctorDto,
        user: lastUserCreated,
      });

      const profileSaved =
        await this.profileDoctorRepository.save(profileToSave);

      const {
        id,
        hospital,
        job,
        address,
        phoneNumber,
        sex,
        bio,
        urlImg,
        createdAt,
      } = profileSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Profile created sucessfully',
        data: {
          id,
          hospital,
          job,
          address,
          phoneNumber,
          sex,
          bio,
          urlImg,
          createdAt,
        },
        path: '/profiles/create/profile',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Profile | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Profile',
          error: error.message,
          path: '/profiles/create/profile',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(request: Request) {
    try {
      const { idUser } = request['user'];

      const profile = await this.profilesRepository
        .createQueryBuilder('profile')
        .leftJoinAndSelect('profile.tags', 'tag')
        .where('profile.userId = :userId', { userId: idUser })
        .getOne();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Profile fetched sucessfully.',
        data: profile,
        path: '/profile',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this Profile. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this profile.',
          error: error.message,
          path: '/profile',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByPkDoctor(request: Request) {
    try {
      const { idUser } = request['user'];

      const profile = await this.profileDoctorRepository
        .createQueryBuilder('profile')
        .where('profile.userId = :userId', { userId: idUser })
        .getOne();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Profile fetched sucessfully.',
        data: profile,
        path: '/profile',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this Profile. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this profile.',
          error: error.message,
          path: '/profile',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateOne(
    request: Request,
    updateProfileDto: Partial<UpdateProfileDto>,
  ) {
    try {
      const { idUser } = request['user'];

      const profile = await this.profilesRepository
        .createQueryBuilder('profile')
        .leftJoin('profile.tags', 'tag')
        .where('profile.userId = :userId', { userId: idUser })
        .getOne();

      const profileToSave = { ...profile, ...updateProfileDto };

      const { id, user, birthday, bio, tags, urlImg, createdAt, updatedAt } =
        await this.profilesRepository.save(profileToSave);

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Profile updated sucessfully',
        data: {
          id,
          user,
          birthday,
          bio,
          tags,
          urlImg,
          createdAt,
          updatedAt,
        },
        path: '/profiles/profile/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new Profile | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Não foi possível atualizar o dados do perfil do usuário!',
          error: error.message,
          path: '/profiles/profile/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const tagToDelete = await this.profilesRepository.findOneBy({ id });
      if (!tagToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Profile Not Found',
            path: '/profiles/profile/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.profilesRepository.remove(tagToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Profile deleted sucessfully',
        path: '/profiles/delete/profile/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete Profile | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete Profile',
          error: error.message,
          path: '/profiles/delete/profile/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async suggestVideo(request: Request, createSuggestYTDto: CreateSuggestYTDto) {
    try {
      const { idUser: idUserFromRequest } = request['user'];

      const userData = await this.userRepository.findOneBy({
        id: idUserFromRequest,
      });

      const toSave = this.suggestVideoRepo.create({
        ...createSuggestYTDto,
        user: userData,
      });

      const saved = await this.suggestVideoRepo.save(toSave);

      const { id, user, suggestion, createdAt } = saved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Profile created sucessfully',
        data: {
          id,
          user,
          suggestion,
          createdAt,
        },
        path: '/profiles/create/profile',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Profile | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Profile',
          error: error.message,
          path: '/profiles/create/profile',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async report(request: Request, createReportDto: CreateReportDto) {
    try {
      const { idUser } = request['user'];

      // const userData = await this.userRepository.findOneBy({
      //   id: idUser,
      // });

      //symptom

      const symptoms = await this.symptomRepository
        .createQueryBuilder('symptom')
        .where('symptom.userId = :userId', {
          userId: idUser,
        })
        .andWhere('DATE(symptom.created_at) = :date', {
          date: createReportDto.date,
        })
        .getMany();

      //consultas

      const appointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.userId = :userId', {
          userId: idUser,
        })
        .andWhere('DATE(appointment.created_at) = :date', {
          date: createReportDto.date,
        })
        .getMany();

      //medications
      const medications = await this.medicationRepository
        .createQueryBuilder('medication')
        .where('medication.userId = :userId', {
          userId: idUser,
        })
        .andWhere('DATE(medication.created_at) = :date', {
          date: createReportDto.date,
        })
        .getMany();

      //daily
      const dailys = await this.dailyRepository
        .createQueryBuilder('daily')
        .where('daily.userId = :userId', {
          userId: idUser,
        })
        .andWhere('DATE(daily.created_at) = :date', {
          date: createReportDto.date,
        })
        .getMany();

      console.log([
        { countSymptoms: symptoms.length, symptoms },
        { countAppointments: appointments.length, appointments },
        { countMedications: medications.length, medications },
        { countDailys: dailys.length, dailys },
      ]);

      return {
        statusCode: 200,
        method: 'GET',
        message: 'reports fetched sucessfully.',
        data: [
          { countSymptoms: symptoms.length, symptoms },
          { countAppointments: appointments.length, appointments },
          { countMedications: medications.length, medications },
          { countDailys: dailys.length, dailys },
        ],
        path: '/reports',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch reports | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch reports.',
          path: '/reports/all',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
