import { Module } from '@nestjs/common';
import { RoomAmenitiesService } from './room_amenities.service.js';
import { RoomAmenitiesController } from './room_amenities.controller.js';

@Module({
  controllers: [RoomAmenitiesController],
  providers: [RoomAmenitiesService],
})
export class RoomAmenitiesModule {}
