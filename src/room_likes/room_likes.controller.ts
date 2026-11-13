import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomLikesService } from './room_likes.service.js';
import { CreateRoomLikeDto } from './dto/create-room_like.dto.js';
import { UpdateRoomLikeDto } from './dto/update-room_like.dto.js';

@Controller('room-likes')
export class RoomLikesController {
  constructor(private readonly roomLikesService: RoomLikesService) {}

  @Post()
  create(@Body() createRoomLikeDto: CreateRoomLikeDto) {
    return this.roomLikesService.create(createRoomLikeDto);
  }

  @Get()
  findAll() {
    return this.roomLikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomLikesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomLikeDto: UpdateRoomLikeDto) {
    return this.roomLikesService.update(+id, updateRoomLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomLikesService.remove(+id);
  }
}
