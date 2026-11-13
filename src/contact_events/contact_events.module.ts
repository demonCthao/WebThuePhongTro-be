import { Module } from '@nestjs/common';
import { ContactEventsService } from './contact_events.service.js';
import { ContactEventsController } from './contact_events.controller.js';

@Module({
  controllers: [ContactEventsController],
  providers: [ContactEventsService],
})
export class ContactEventsModule {}
