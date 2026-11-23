import { Module } from '@nestjs/common';
import { AdsService } from './ads.service.js';
import { AdsController } from './ads.controller.js';

@Module({
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}
