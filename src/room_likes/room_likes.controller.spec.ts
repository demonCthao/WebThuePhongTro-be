import { Test, TestingModule } from '@nestjs/testing';
import { RoomLikesController } from './room_likes.controller.js';
import { RoomLikesService } from './room_likes.service.js';

describe('RoomLikesController', () => {
  let controller: RoomLikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomLikesController],
      providers: [RoomLikesService],
    }).compile();

    controller = module.get<RoomLikesController>(RoomLikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
