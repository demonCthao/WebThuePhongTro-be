import { Test, TestingModule } from '@nestjs/testing';
import { AdPlacementsController } from './ad_placements.controller.js';
import { AdPlacementsService } from './ad_placements.service.js';

describe('AdPlacementsController', () => {
  let controller: AdPlacementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdPlacementsController],
      providers: [AdPlacementsService],
    }).compile();

    controller = module.get<AdPlacementsController>(AdPlacementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
