import { Test, TestingModule } from '@nestjs/testing';
import { ViewingAppointmentsController } from './viewing_appointments.controller.js';
import { ViewingAppointmentsService } from './viewing_appointments.service.js';

describe('ViewingAppointmentsController', () => {
  let controller: ViewingAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewingAppointmentsController],
      providers: [ViewingAppointmentsService],
    }).compile();

    controller = module.get<ViewingAppointmentsController>(ViewingAppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
