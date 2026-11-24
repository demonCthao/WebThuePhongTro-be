import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AmenitiesService } from './amenities.service.js';
import { CreateAmenityDto } from './dto/create-amenity.dto.js';
import { UpdateAmenityDto } from './dto/update-amenity.dto.js';
import { FindAllQuery } from '../common/dto/find-all-query.dto.js';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) { }

  @Post()
  create(@Body() createAmenityDto: CreateAmenityDto) {
    return this.amenitiesService.create(createAmenityDto);
  }

  @Get()
  findAmenitiesWithPagination(@Query() query: FindAllQuery) {
    return this.amenitiesService.findAmenitiesWithPagination(query);
  }

  @Get("/all")
  findAll() {
    return this.amenitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amenitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAmenityDto: UpdateAmenityDto) {
    return this.amenitiesService.update(+id, updateAmenityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.amenitiesService.remove(+id);
  }
}
