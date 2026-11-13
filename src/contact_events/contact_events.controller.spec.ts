import { Test, TestingModule } from '@nestjs/testing';
import { ContactEventsController } from './contact_events.controller.js';
import { ContactEventsService } from './contact_events.service.js';

describe('ContactEventsController', () => {
  let controller: ContactEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactEventsController],
      providers: [ContactEventsService],
    }).compile();

    controller = module.get<ContactEventsController>(ContactEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
