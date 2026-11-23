import { Module } from '@nestjs/common';
import { AdStatsService } from './ad_stats.service.js';
import { AdStatsController } from './ad_stats.controller.js';

@Module({
  controllers: [AdStatsController],
  providers: [AdStatsService],
})
export class AdStatsModule {}
