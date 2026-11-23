import { Test, TestingModule } from '@nestjs/testing';
import { AdStatsController } from './ad_stats.controller.js';
import { AdStatsService } from './ad_stats.service.js';

describe('AdStatsController', () => {
  let controller: AdStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdStatsController],
      providers: [AdStatsService],
    }).compile();

    controller = module.get<AdStatsController>(AdStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
