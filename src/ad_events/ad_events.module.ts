import { Module } from '@nestjs/common';
import { AdEventsService } from './ad_events.service.js';
import { AdEventsController } from './ad_events.controller.js';

@Module({
  controllers: [AdEventsController],
  providers: [AdEventsService],
})
export class AdEventsModule {}
