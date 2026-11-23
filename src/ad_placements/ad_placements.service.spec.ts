import { Test, TestingModule } from '@nestjs/testing';
import { AdPlacementsService } from './ad_placements.service.js';

describe('AdPlacementsService', () => {
  let service: AdPlacementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdPlacementsService],
    }).compile();

    service = module.get<AdPlacementsService>(AdPlacementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
