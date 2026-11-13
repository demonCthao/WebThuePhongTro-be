import { Module } from '@nestjs/common';
import { RoomStatsService } from './room_stats.service.js';
import { RoomStatsController } from './room_stats.controller.js';

@Module({
  controllers: [RoomStatsController],
  providers: [RoomStatsService],
})
export class RoomStatsModule {}
