import { Injectable } from '@nestjs/common';
import { CreateRoomAmenityDto } from './dto/create-room_amenity.dto.js';
import { UpdateRoomAmenityDto } from './dto/update-room_amenity.dto.js';

@Injectable()
export class RoomAmenitiesService {
  create(createRoomAmenityDto: CreateRoomAmenityDto) {
    return 'This action adds a new roomAmenity';
  }

  findAll() {
    return `This action returns all roomAmenities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomAmenity`;
  }

  update(id: number, updateRoomAmenityDto: UpdateRoomAmenityDto) {
    return `This action updates a #${id} roomAmenity`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomAmenity`;
  }
}
