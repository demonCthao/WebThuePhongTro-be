import { Test, TestingModule } from '@nestjs/testing';
import { AdStatsService } from './ad_stats.service.js';

describe('AdStatsService', () => {
  let service: AdStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdStatsService],
    }).compile();

    service = module.get<AdStatsService>(AdStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
