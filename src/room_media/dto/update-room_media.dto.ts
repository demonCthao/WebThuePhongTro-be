import { PartialType } from '@nestjs/swagger';
import { CreateRoomMediaDto } from './create-room_media.dto.js';

export class UpdateRoomMediaDto extends PartialType(CreateRoomMediaDto) {}
