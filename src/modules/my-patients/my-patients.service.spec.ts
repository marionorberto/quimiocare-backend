import { Test, TestingModule } from '@nestjs/testing';
import { MedicationService } from './my-patients.service';

describe('MedicationService', () => {
  let service: MedicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicationService],
    }).compile();

    service = module.get<MedicationService>(MedicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
