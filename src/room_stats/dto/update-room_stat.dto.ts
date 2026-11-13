import { PartialType } from '@nestjs/swagger';
import { CreateRoomStatDto } from './create-room_stat.dto.js';

export class UpdateRoomStatDto extends PartialType(CreateRoomStatDto) {}
