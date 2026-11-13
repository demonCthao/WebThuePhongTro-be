import { Injectable } from '@nestjs/common';
import { CreateRoomLikeDto } from './dto/create-room_like.dto.js';
import { UpdateRoomLikeDto } from './dto/update-room_like.dto.js';

@Injectable()
export class RoomLikesService {
  create(createRoomLikeDto: CreateRoomLikeDto) {
    return 'This action adds a new roomLike';
  }

  findAll() {
    return `This action returns all roomLikes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomLike`;
  }

  update(id: number, updateRoomLikeDto: UpdateRoomLikeDto) {
    return `This action updates a #${id} roomLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomLike`;
  }
}
