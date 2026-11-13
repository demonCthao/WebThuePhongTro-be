import { Module } from '@nestjs/common';
import { RoomReportsService } from './room_reports.service.js';
import { RoomReportsController } from './room_reports.controller.js';

@Module({
  controllers: [RoomReportsController],
  providers: [RoomReportsService],
})
export class RoomReportsModule {}
