import { Test, TestingModule } from '@nestjs/testing';
import { RoomCategoriesController } from './room_categories.controller.js';
import { RoomCategoriesService } from './room_categories.service.js';

describe('RoomCategoriesController', () => {
  let controller: RoomCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomCategoriesController],
      providers: [RoomCategoriesService],
    }).compile();

    controller = module.get<RoomCategoriesController>(RoomCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
