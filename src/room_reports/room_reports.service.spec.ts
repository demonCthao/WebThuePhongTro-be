import { Test, TestingModule } from '@nestjs/testing';
import { RoomReportsService } from './room_reports.service.js';

describe('RoomReportsService', () => {
  let service: RoomReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomReportsService],
    }).compile();

    service = module.get<RoomReportsService>(RoomReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
