import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomShareDetailsService } from './room_share_details.service.js';
import { CreateRoomShareDetailDto } from './dto/create-room_share_detail.dto.js';
import { UpdateRoomShareDetailDto } from './dto/update-room_share_detail.dto.js';

@Controller('room-share-details')
export class RoomShareDetailsController {
  constructor(private readonly roomShareDetailsService: RoomShareDetailsService) {}

  @Post()
  create(@Body() createRoomShareDetailDto: CreateRoomShareDetailDto) {
    return this.roomShareDetailsService.create(createRoomShareDetailDto);
  }

  @Get()
  findAll() {
    return this.roomShareDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomShareDetailsService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomShareDetailDto: UpdateRoomShareDetailDto) {
    return this.roomShareDetailsService.update(BigInt(id), updateRoomShareDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomShareDetailsService.remove(BigInt(id));
  }
}
