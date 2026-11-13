import { Test, TestingModule } from '@nestjs/testing';
import { RoomStatsService } from './room_stats.service.js';

describe('RoomStatsService', () => {
  let service: RoomStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomStatsService],
    }).compile();

    service = module.get<RoomStatsService>(RoomStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
