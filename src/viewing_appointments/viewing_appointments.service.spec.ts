import { Test, TestingModule } from '@nestjs/testing';
import { ViewingAppointmentsService } from './viewing_appointments.service.js';

describe('ViewingAppointmentsService', () => {
  let service: ViewingAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewingAppointmentsService],
    }).compile();

    service = module.get<ViewingAppointmentsService>(ViewingAppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
