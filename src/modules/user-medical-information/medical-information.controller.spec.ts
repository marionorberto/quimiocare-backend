import { Test, TestingModule } from '@nestjs/testing';
import { MedicalInformationController } from './medical-information.controller';

describe('MedicalInformationController', () => {
  let controller: MedicalInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalInformationController],
    }).compile();

    controller = module.get<MedicalInformationController>(
      MedicalInformationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
