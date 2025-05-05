import { Test, TestingModule } from '@nestjs/testing';
import { CancertypesService } from './cancer-types.service';

describe('CancertypesService', () => {
  let service: CancertypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancertypesService],
    }).compile();

    service = module.get<CancertypesService>(CancertypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
