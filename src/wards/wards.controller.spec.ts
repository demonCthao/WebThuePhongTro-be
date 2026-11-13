import { Test, TestingModule } from '@nestjs/testing';
import { WardsController } from './wards.controller.js';
import { WardsService } from './wards.service.js';

describe('WardsController', () => {
  let controller: WardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WardsController],
      providers: [WardsService],
    }).compile();

    controller = module.get<WardsController>(WardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
