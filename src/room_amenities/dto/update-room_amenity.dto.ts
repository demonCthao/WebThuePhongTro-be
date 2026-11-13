import { PartialType } from '@nestjs/swagger';
import { CreateRoomAmenityDto } from './create-room_amenity.dto.js';

export class UpdateRoomAmenityDto extends PartialType(CreateRoomAmenityDto) {}
