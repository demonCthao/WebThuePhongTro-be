import { Module } from '@nestjs/common';
import { RoomMediaService } from './room_media.service.js';
import { RoomMediaController } from './room_media.controller.js';

@Module({
  controllers: [RoomMediaController],
  providers: [RoomMediaService],
})
export class RoomMediaModule {}
