import { Module } from '@nestjs/common';
import { RoomLikesService } from './room_likes.service.js';
import { RoomLikesController } from './room_likes.controller.js';

@Module({
  controllers: [RoomLikesController],
  providers: [RoomLikesService],
})
export class RoomLikesModule {}
