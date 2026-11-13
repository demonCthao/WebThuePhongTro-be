import { Test, TestingModule } from '@nestjs/testing';
import { RoommateRequestsService } from './roommate_requests.service.js';

describe('RoommateRequestsService', () => {
  let service: RoommateRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoommateRequestsService],
    }).compile();

    service = module.get<RoommateRequestsService>(RoommateRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
