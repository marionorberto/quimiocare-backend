import { Test, TestingModule } from '@nestjs/testing';
import { ativitiesController } from './activities.controller';

describe('ativitiesController', () => {
  let controller: ativitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ativitiesController],
    }).compile();

    controller = module.get<ativitiesController>(ativitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
