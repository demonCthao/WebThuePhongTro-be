import { PartialType } from '@nestjs/swagger';
import { CreateViewingAppointmentDto } from './create-viewing_appointment.dto.js';

export class UpdateViewingAppointmentDto extends PartialType(CreateViewingAppointmentDto) {}
