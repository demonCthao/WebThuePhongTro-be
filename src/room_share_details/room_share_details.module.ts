import { Module } from '@nestjs/common';
import { RoomShareDetailsService } from './room_share_details.service.js';
import { RoomShareDetailsController } from './room_share_details.controller.js';

@Module({
  controllers: [RoomShareDetailsController],
  providers: [RoomShareDetailsService],
})
export class RoomShareDetailsModule {}
