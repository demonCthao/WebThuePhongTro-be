import { Module } from '@nestjs/common';
import { RoomCategoriesService } from './room_categories.service.js';
import { RoomCategoriesController } from './room_categories.controller.js';

@Module({
  controllers: [RoomCategoriesController],
  providers: [RoomCategoriesService],
})
export class RoomCategoriesModule {}
