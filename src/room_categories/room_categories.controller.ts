import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoomCategoriesService } from './room_categories.service.js';
import { CreateRoomCategoryDto } from './dto/create-room_category.dto.js';
import { UpdateRoomCategoryDto } from './dto/update-room_category.dto.js';
import { FindAllQuery } from '../common/dto/find-all-query.dto.js';

@Controller('room-categories')
export class RoomCategoriesController {
  constructor(private readonly roomCategoriesService: RoomCategoriesService) { }

  @Post()
  create(@Body() createRoomCategoryDto: CreateRoomCategoryDto) {
    return this.roomCategoriesService.create(createRoomCategoryDto);
  }

  @Get()
  findRoomCategoriesWithPagination(@Query() query: FindAllQuery) {
    return this.roomCategoriesService.findRoomCategoriesWithPagination(query);
  }

  @Get("/all")
  findAll() {
    return this.roomCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomCategoryDto: UpdateRoomCategoryDto) {
    return this.roomCategoriesService.update(+id, updateRoomCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomCategoriesService.remove(+id);
  }
}
