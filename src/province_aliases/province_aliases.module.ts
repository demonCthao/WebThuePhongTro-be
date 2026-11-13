import { Module } from '@nestjs/common';
import { ProvinceAliasesService } from './province_aliases.service.js';
import { ProvinceAliasesController } from './province_aliases.controller.js';

@Module({
  controllers: [ProvinceAliasesController],
  providers: [ProvinceAliasesService],
})
export class ProvinceAliasesModule {}
