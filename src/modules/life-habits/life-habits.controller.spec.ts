import { Test, TestingModule } from '@nestjs/testing';
import { UserLifeHabitsController } from './life-habits.controller';

describe('UserLifeHabitsController', () => {
  let controller: UserLifeHabitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserLifeHabitsController],
    }).compile();

    controller = module.get<UserLifeHabitsController>(UserLifeHabitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
