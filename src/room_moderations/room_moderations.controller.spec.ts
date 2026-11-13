import { Test, TestingModule } from '@nestjs/testing';
import { RoomModerationsController } from './room_moderations.controller.js';
import { RoomModerationsService } from './room_moderations.service.js';

describe('RoomModerationsController', () => {
  let controller: RoomModerationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomModerationsController],
      providers: [RoomModerationsService],
    }).compile();

    controller = module.get<RoomModerationsController>(RoomModerationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
