import { Test, TestingModule } from '@nestjs/testing';
import { RoomShareDetailsController } from './room_share_details.controller.js';
import { RoomShareDetailsService } from './room_share_details.service.js';

describe('RoomShareDetailsController', () => {
  let controller: RoomShareDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomShareDetailsController],
      providers: [RoomShareDetailsService],
    }).compile();

    controller = module.get<RoomShareDetailsController>(RoomShareDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
