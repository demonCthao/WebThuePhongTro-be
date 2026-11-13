import { Test, TestingModule } from '@nestjs/testing';
import { RoomMediaController } from './room_media.controller.js';
import { RoomMediaService } from './room_media.service.js';

describe('RoomMediaController', () => {
  let controller: RoomMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomMediaController],
      providers: [RoomMediaService],
    }).compile();

    controller = module.get<RoomMediaController>(RoomMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
