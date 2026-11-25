import { Module } from '@nestjs/common';
import { ViewingAppointmentsService } from './viewing_appointments.service.js';
import { ViewingAppointmentsController } from './viewing_appointments.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [
    ViewingAppointmentsController,
  ],
  providers: [
    ViewingAppointmentsService,
  ],
})
export class ViewingAppointmentsModule { }
