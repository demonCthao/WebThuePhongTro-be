import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdEventsService } from './ad_events.service.js';
import { CreateAdEventDto } from './dto/create-ad_event.dto.js';
import { UpdateAdEventDto } from './dto/update-ad_event.dto.js';

@Controller('ad-events')
export class AdEventsController {
  constructor(private readonly adEventsService: AdEventsService) {}

  @Post()
  create(@Body() createAdEventDto: CreateAdEventDto) {
    return this.adEventsService.create(createAdEventDto);
  }

  @Get()
  findAll() {
    return this.adEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adEventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdEventDto: UpdateAdEventDto) {
    return this.adEventsService.update(+id, updateAdEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adEventsService.remove(+id);
  }
}
