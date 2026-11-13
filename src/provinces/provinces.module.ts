import { Module } from '@nestjs/common';
import { ProvincesService } from './provinces.service.js';
import { ProvincesController } from './provinces.controller.js';

@Module({
  controllers: [ProvincesController],
  providers: [ProvincesService],
})
export class ProvincesModule {}
