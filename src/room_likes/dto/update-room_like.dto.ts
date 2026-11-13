import { PartialType } from '@nestjs/swagger';
import { CreateRoomLikeDto } from './create-room_like.dto.js';

export class UpdateRoomLikeDto extends PartialType(CreateRoomLikeDto) {}
