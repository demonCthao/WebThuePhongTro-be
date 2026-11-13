import { Test, TestingModule } from '@nestjs/testing';
import { RoomReportsController } from './room_reports.controller.js';
import { RoomReportsService } from './room_reports.service.js';

describe('RoomReportsController', () => {
  let controller: RoomReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomReportsController],
      providers: [RoomReportsService],
    }).compile();

    controller = module.get<RoomReportsController>(RoomReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
