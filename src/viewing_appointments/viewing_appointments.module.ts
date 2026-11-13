import { Module } from '@nestjs/common';
import { ViewingAppointmentsService } from './viewing_appointments.service.js';
import { ViewingAppointmentsController } from './viewing_appointments.controller.js';

@Module({
  controllers: [ViewingAppointmentsController],
  providers: [ViewingAppointmentsService],
})
export class ViewingAppointmentsModule {}
