import { Test, TestingModule } from '@nestjs/testing';
import { RoomShareDetailsService } from './room_share_details.service.js';

describe('RoomShareDetailsService', () => {
  let service: RoomShareDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomShareDetailsService],
    }).compile();

    service = module.get<RoomShareDetailsService>(RoomShareDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
