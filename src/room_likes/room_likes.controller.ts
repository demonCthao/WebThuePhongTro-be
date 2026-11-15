
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { RoomLikesService } from './room_likes.service.js';
import { CreateRoomLikeDto } from './dto/create-room_like.dto.js';

@Controller('room-likes')
export class RoomLikesController {
  constructor(private readonly roomLikesService: RoomLikesService) { }

  // Thêm phòng yêu thích
  @Post()
  create(@Body() createRoomLikeDto: CreateRoomLikeDto) {
    return this.roomLikesService.create(createRoomLikeDto);
  }

  // Lấy tất cả lượt yêu thích
  @Get()
  findAll() {
    return this.roomLikesService.findAll();
  }

  // Lấy danh sách phòng yêu thích theo user_id
  @Get('user/:userId')
  findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.roomLikesService.findByUserId(userId);
  }

  // Kiểm tra user đã yêu thích phòng chưa
  @Get(':userId/:roomId')
  checkLike(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    return this.roomLikesService.checkLike(userId, roomId);
  }

  // Lấy thông tin lượt yêu thích
  @Get(':userId/:roomId/detail')
  findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    return this.roomLikesService.findOne(userId, roomId);
  }

  // Bỏ yêu thích phòng
  @Delete(':userId/:roomId')
  remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    return this.roomLikesService.remove(userId, roomId);
  }
}
