import { Test, TestingModule } from '@nestjs/testing';
import { RoomAmenitiesController } from './room_amenities.controller.js';
import { RoomAmenitiesService } from './room_amenities.service.js';

describe('RoomAmenitiesController', () => {
  let controller: RoomAmenitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomAmenitiesController],
      providers: [RoomAmenitiesService],
    }).compile();

    controller = module.get<RoomAmenitiesController>(RoomAmenitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
