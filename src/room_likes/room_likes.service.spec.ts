import { Test, TestingModule } from '@nestjs/testing';
import { RoomLikesService } from './room_likes.service.js';

describe('RoomLikesService', () => {
  let service: RoomLikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomLikesService],
    }).compile();

    service = module.get<RoomLikesService>(RoomLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
