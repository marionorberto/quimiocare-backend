import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMyPatientsDto } from './dtos/create-my-patients.dto';
// import { UpdateMyPatientsDto } from './dtos/update-my-patients.dto';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
import { MyPatients } from 'src/database/entities/my-patients/my-patiets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/database/entities/profiles/user-profile.entity';
import { ProfileDoctor } from 'src/database/entities/profiles-doctor/user-profile-doctor.entity';
@Injectable()
export class MyPatientsService {
  private myPatientsRepository: Repository<MyPatients>;
  private userRepository: Repository<User>;
  constructor(
    private readonly datasource: DataSource,
    private readonly userServices: UsersService,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(ProfileDoctor)
    private readonly profileDoctorRepository: Repository<ProfileDoctor>,
  ) {
    this.myPatientsRepository = this.datasource.getRepository(MyPatients);
    this.userRepository = this.datasource.getRepository(User);
  }

  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const allMedication = await this.myPatientsRepository
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
      const medication = await this.myPatientsRepository.findOneBy({ id });

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

  async create(createMedicationDto: CreateMyPatientsDto) {
    try {
      const { doctor: doctorId, patient: patientId } = createMedicationDto;

      const patientFetched = await this.userRepository.findOneBy({
        id: patientId,
      });
      const doctorFetched = await this.userRepository.findOneBy({
        id: doctorId,
      });

      if (!patientFetched || !doctorFetched) {
        throw new HttpException(
          {
            statusCode: 404,
            method: 'POST',
            message: 'Médico ou paciente não encontrado.',
            path: '/my-patients/create/my-patient',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // ✅ 1. Verificar se o médico já tem 4 pacientes
      const patientCount = await this.myPatientsRepository.count({
        where: { doctor: { id: doctorId } },
      });

      if (patientCount >= 4) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'Este médico já possui o número máximo de pacientes (4).',
            path: '/my-patients/create/my-patient',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // ✅ 2. Verificar se o paciente já está atribuído a este médico
      const existingRelation = await this.myPatientsRepository.findOne({
        where: {
          doctor: { id: doctorId },
          patient: { id: patientId },
        },
      });

      if (existingRelation) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'Este paciente já está atribuído a este médico.',
            path: '/my-patients/create/my-patient',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // ✅ 3. Verificar se o paciente já está atribuído a qualquer outro médico
      const alreadyAssignedToAnotherDoctor =
        await this.myPatientsRepository.findOne({
          where: {
            patient: { id: patientId },
          },
        });

      if (alreadyAssignedToAnotherDoctor) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'Este paciente já está atribuído a outro médico.',
            path: '/my-patients/create/my-patient',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // ✅ Criar o relacionamento
      const myPatientsToSave = this.myPatientsRepository.create({
        doctor: doctorFetched,
        patient: patientFetched,
      });

      const dataSaved = await this.myPatientsRepository.save(myPatientsToSave);

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Relacionamento médico/paciente criado com sucesso.',
        data: dataSaved,
        path: '/my-patients/create/my-patients',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Erro ao criar relação médico/paciente: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: error.message,
          error: error.message,
          path: '/my-patients/create/my-patient',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // async updateOne(
  //   id: string,
  //   updateMyPatientsDto: Partial<UpdateMyPatientsDto>,
  // ) {
  //   try {
  //     await this.myPatientsRepository.update(id, updateMyPatientsDto);

  //     const { createdAt, updatedAt } =
  //       await this.myPatientsRepository.findOneBy({ id });

  //     return {
  //       statusCode: 200,
  //       method: 'PUT',
  //       message: 'Medication updated sucessfully',
  //       data: {
  //         id,
  //         name,
  //         createdAt,
  //         updatedAt,
  //       },
  //       path: '/medications/update/medication/:id',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(
  //       `Failed to update new Medication | Error Message: ${error.message}`,
  //     );

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'PUT',
  //         message: 'Failed to update Medication',
  //         error: error.message,
  //         path: '/medications/update/medication/:id',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  async deleteOne(id: string) {
    try {
      const medicationToDelete = await this.myPatientsRepository.findOneBy({
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

      await this.myPatientsRepository.remove(medicationToDelete);

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

      const [last] = await this.myPatientsRepository.find({
        where: {
          doctor: {
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
  async findAllPatientsFromDoctor(request: Request) {
    try {
      const { idUser } = request['user'];

      const doctorExists = await this.userRepository.findOneBy({
        id: idUser,
      });

      if (!doctorExists) {
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Médico não encontrado.',
            path: `/my-patients/doctor/${idUser}/patients`,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const patients = await this.myPatientsRepository.find({
        where: {
          doctor: { id: idUser },
        },
        relations: {
          patient: true,
        },
      });

      // Obtemos todos os dados completos dos pacientes, incluindo imgUrl
      const allPatientDataWithImg = await Promise.all(
        patients.map(async (entry) => {
          const patient = entry.patient;

          if (patient.typeUser === 'PACIENTE') {
            const profileUserData = await this.profileRepository.findOne({
              where: {
                user: { id: patient.id },
              },
              relations: {
                user: {
                  tags: true,
                },
              },
              order: {
                createdAt: 'DESC',
              },
            });

            return {
              ...patient,
              imgUrl: profileUserData?.urlImg || null,
              phoneNumber: profileUserData.phoneNumber,
            };
          }

          // Se quiser tratar outros tipos de usuários no futuro
          return patient;
        }),
      );

      console.log(allPatientDataWithImg);
      return {
        statusCode: 200,
        method: 'GET',
        message: 'Pacientes recuperados com sucesso.',
        data: allPatientDataWithImg,
        path: `/my-patients/doctor/${idUser}/patients`,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Erro ao buscar pacientes: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: error.message,
          error: error.message,
          path: `/my-patients/doctor/patients`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findDoctorFromPatient(request: Request) {
    try {
      const { idUser } = request['user']; // ID do paciente

      const patientExists = await this.userRepository.findOneBy({
        id: idUser,
      });

      if (!patientExists) {
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Paciente não encontrado.',
            path: `/my-patients/patient/${idUser}/doctor`,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const doctorRelation = await this.myPatientsRepository.findOne({
        where: {
          patient: { id: idUser },
        },
        relations: {
          doctor: true,
        },
      });

      if (!doctorRelation) {
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Nenhum médico atribuído a este paciente.',
            path: `/my-patients/patient/${idUser}/doctor`,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const doctor = doctorRelation.doctor;

      const profileDoctor = await this.profileDoctorRepository.findOne({
        where: {
          user: { id: doctor.id },
        },
        relations: {
          user: {
            tags: true,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });

      const doctorData = {
        ...doctor,
        imgUrl: profileDoctor?.urlImg || null,
        phoneNumber: profileDoctor?.phoneNumber || null,
        bio: profileDoctor?.bio || null,
        address: profileDoctor?.address || null,
        speciality: profileDoctor?.speciality || null,
      };

      console.log('xxx', doctorData);

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Médico do paciente recuperado com sucesso.',
        data: doctorData,
        path: `/my-patients/patient/${idUser}/doctor`,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Erro ao buscar médico do paciente: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: error.message,
          error: error.message,
          path: `/my-patients/patient/doctor`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
