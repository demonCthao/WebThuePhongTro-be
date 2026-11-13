import { Test, TestingModule } from '@nestjs/testing';
import { RoomModerationsService } from './room_moderations.service.js';

describe('RoomModerationsService', () => {
  let service: RoomModerationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomModerationsService],
    }).compile();

    service = module.get<RoomModerationsService>(RoomModerationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
