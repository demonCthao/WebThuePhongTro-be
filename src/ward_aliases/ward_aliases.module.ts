import { Module } from '@nestjs/common';
import { WardAliasesService } from './ward_aliases.service.js';
import { WardAliasesController } from './ward_aliases.controller.js';

@Module({
  controllers: [WardAliasesController],
  providers: [WardAliasesService],
})
export class WardAliasesModule {}
