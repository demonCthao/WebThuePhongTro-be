import { Module } from '@nestjs/common';
import { RoommateRequestsService } from './roommate_requests.service.js';
import { RoommateRequestsController } from './roommate_requests.controller.js';

@Module({
  controllers: [RoommateRequestsController],
  providers: [RoommateRequestsService],
})
export class RoommateRequestsModule {}
