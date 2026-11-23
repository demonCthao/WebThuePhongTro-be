import { Module } from '@nestjs/common';
import { AdPlacementsService } from './ad_placements.service.js';
import { AdPlacementsController } from './ad_placements.controller.js';

@Module({
  controllers: [AdPlacementsController],
  providers: [AdPlacementsService],
})
export class AdPlacementsModule {}
