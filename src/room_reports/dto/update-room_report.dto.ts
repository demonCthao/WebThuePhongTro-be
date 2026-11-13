import { PartialType } from '@nestjs/swagger';
import { CreateRoomReportDto } from './create-room_report.dto.js';

export class UpdateRoomReportDto extends PartialType(CreateRoomReportDto) {}
