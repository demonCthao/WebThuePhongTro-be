import { Test, TestingModule } from '@nestjs/testing';
import { ContactEventsService } from './contact_events.service.js';

describe('ContactEventsService', () => {
  let service: ContactEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactEventsService],
    }).compile();

    service = module.get<ContactEventsService>(ContactEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
