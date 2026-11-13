import { Test, TestingModule } from '@nestjs/testing';
import { RoommateRequestsController } from './roommate_requests.controller.js';
import { RoommateRequestsService } from './roommate_requests.service.js';

describe('RoommateRequestsController', () => {
  let controller: RoommateRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoommateRequestsController],
      providers: [RoommateRequestsService],
    }).compile();

    controller = module.get<RoommateRequestsController>(RoommateRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
