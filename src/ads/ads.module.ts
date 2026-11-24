import { Module } from '@nestjs/common';
import { AdsService } from './ads.service.js';
import { AdsController } from './ads.controller.js';
import { UploadsModule } from '../modules/uploads/uploads.module.js';

@Module({
  imports: [
    UploadsModule,
  ],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule { }
