import { Test, TestingModule } from '@nestjs/testing';
import { AdEventsController } from './ad_events.controller.js';
import { AdEventsService } from './ad_events.service.js';

describe('AdEventsController', () => {
  let controller: AdEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdEventsController],
      providers: [AdEventsService],
    }).compile();

    controller = module.get<AdEventsController>(AdEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
