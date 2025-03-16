import { Test, TestingModule } from '@nestjs/testing';
import { CancertypesController } from './cancer-types.controller';

describe('CancertypesController', () => {
  let controller: CancertypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancertypesController],
    }).compile();

    controller = module.get<CancertypesController>(CancertypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
