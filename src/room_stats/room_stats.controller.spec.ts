import { Test, TestingModule } from '@nestjs/testing';
import { RoomStatsController } from './room_stats.controller.js';
import { RoomStatsService } from './room_stats.service.js';

describe('RoomStatsController', () => {
  let controller: RoomStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomStatsController],
      providers: [RoomStatsService],
    }).compile();

    controller = module.get<RoomStatsController>(RoomStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
