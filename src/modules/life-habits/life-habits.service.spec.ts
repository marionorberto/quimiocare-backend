import { Test, TestingModule } from '@nestjs/testing';
import { UserLifeHabitsService } from './life-habits.service';

describe('UserLifeHabitsService', () => {
  let service: UserLifeHabitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserLifeHabitsService],
    }).compile();

    service = module.get<UserLifeHabitsService>(UserLifeHabitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
