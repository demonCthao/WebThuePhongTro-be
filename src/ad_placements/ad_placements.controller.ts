import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdPlacementsService } from './ad_placements.service.js';
import { CreateAdPlacementDto } from './dto/create-ad_placement.dto.js';
import { UpdateAdPlacementDto } from './dto/update-ad_placement.dto.js';

@Controller('ad-placements')
export class AdPlacementsController {
  constructor(private readonly adPlacementsService: AdPlacementsService) {}

  @Post()
  create(@Body() createAdPlacementDto: CreateAdPlacementDto) {
    return this.adPlacementsService.create(createAdPlacementDto);
  }

  @Get()
  findAll() {
    return this.adPlacementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adPlacementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdPlacementDto: UpdateAdPlacementDto) {
    return this.adPlacementsService.update(+id, updateAdPlacementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adPlacementsService.remove(+id);
  }
}
