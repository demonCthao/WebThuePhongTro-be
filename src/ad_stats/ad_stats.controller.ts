import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdStatsService } from './ad_stats.service.js';
import { CreateAdStatDto } from './dto/create-ad_stat.dto.js';
import { UpdateAdStatDto } from './dto/update-ad_stat.dto.js';

@Controller('ad-stats')
export class AdStatsController {
  constructor(private readonly adStatsService: AdStatsService) {}

  @Post()
  create(@Body() createAdStatDto: CreateAdStatDto) {
    return this.adStatsService.create(createAdStatDto);
  }

  @Get()
  findAll() {
    return this.adStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adStatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdStatDto: UpdateAdStatDto) {
    return this.adStatsService.update(+id, updateAdStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adStatsService.remove(+id);
  }
}
