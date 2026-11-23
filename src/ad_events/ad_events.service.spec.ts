import { Test, TestingModule } from '@nestjs/testing';
import { AdEventsService } from './ad_events.service.js';

describe('AdEventsService', () => {
  let service: AdEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdEventsService],
    }).compile();

    service = module.get<AdEventsService>(AdEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
