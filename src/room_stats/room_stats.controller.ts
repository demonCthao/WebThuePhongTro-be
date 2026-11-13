import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomStatsService } from './room_stats.service.js';
import { CreateRoomStatDto } from './dto/create-room_stat.dto.js';
import { UpdateRoomStatDto } from './dto/update-room_stat.dto.js';

@Controller('room-stats')
export class RoomStatsController {
  constructor(private readonly roomStatsService: RoomStatsService) {}

  @Post()
  create(@Body() createRoomStatDto: CreateRoomStatDto) {
    return this.roomStatsService.create(createRoomStatDto);
  }

  @Get()
  findAll() {
    return this.roomStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomStatsService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomStatDto: UpdateRoomStatDto) {
    return this.roomStatsService.update(BigInt(id), updateRoomStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomStatsService.remove(BigInt(id));
  }
}
