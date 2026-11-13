import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomMediaService } from './room_media.service.js';
import { CreateRoomMediaDto } from './dto/create-room_media.dto.js';
import { UpdateRoomMediaDto } from './dto/update-room_media.dto.js';

@Controller('room-media')
export class RoomMediaController {
  constructor(private readonly roomMediaService: RoomMediaService) {}

  @Post()
  create(@Body() createRoomMediaDto: CreateRoomMediaDto) {
    return this.roomMediaService.create(createRoomMediaDto);
  }

  @Get()
  findAll() {
    return this.roomMediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomMediaService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomMediaDto: UpdateRoomMediaDto) {
    return this.roomMediaService.update(BigInt(id), updateRoomMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomMediaService.remove(BigInt(id));
  }
}
