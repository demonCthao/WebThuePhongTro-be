import { Test, TestingModule } from '@nestjs/testing';
import { RoomMediaService } from './room_media.service.js';

describe('RoomMediaService', () => {
  let service: RoomMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomMediaService],
    }).compile();

    service = module.get<RoomMediaService>(RoomMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
