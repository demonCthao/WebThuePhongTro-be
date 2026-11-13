import { Module } from '@nestjs/common';
import { RoomModerationsService } from './room_moderations.service.js';
import { RoomModerationsController } from './room_moderations.controller.js';

@Module({
  controllers: [RoomModerationsController],
  providers: [RoomModerationsService],
})
export class RoomModerationsModule {}
