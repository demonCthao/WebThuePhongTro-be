import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service.js';
import type { FindAllByPriceQuery } from './rooms.service.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
import { FindAllQuery } from '../common/dto/find-all-query.dto.js';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll(@Query() query: FindAllQuery) {
    return this.roomsService.findAll(query);
  }

  @Get("/by-price")
  findAllByPrice(@Query() query: FindAllByPriceQuery) {
    try {
      return this.roomsService.findAllByPrice(query);
    } catch (error) {
      console.error('Find rooms error:', error);
      throw error;
    }
  }

  @Get("/new")
  findNewRoomByTime() {
    return this.roomsService.findNewRoomByTime();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(BigInt(id), updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(BigInt(id));
  }
}
