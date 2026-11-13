import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomModerationsService } from './room_moderations.service.js';
import { CreateRoomModerationDto } from './dto/create-room_moderation.dto.js';
import { UpdateRoomModerationDto } from './dto/update-room_moderation.dto.js';

@Controller('room-moderations')
export class RoomModerationsController {
  constructor(private readonly roomModerationsService: RoomModerationsService) {}

  @Post()
  create(@Body() createRoomModerationDto: CreateRoomModerationDto) {
    return this.roomModerationsService.create(createRoomModerationDto);
  }

  @Get()
  findAll() {
    return this.roomModerationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomModerationsService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomModerationDto: UpdateRoomModerationDto) {
    return this.roomModerationsService.update(BigInt(id), updateRoomModerationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomModerationsService.remove(BigInt(id));
  }
}
