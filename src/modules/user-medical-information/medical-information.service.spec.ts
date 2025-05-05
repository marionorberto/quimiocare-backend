import { Test, TestingModule } from '@nestjs/testing';
import { MedicalInformationService } from './medical-information.service';

describe('MedicalInformationService', () => {
  let service: MedicalInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalInformationService],
    }).compile();

    service = module.get<MedicalInformationService>(MedicalInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
