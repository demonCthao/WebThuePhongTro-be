import { PartialType } from '@nestjs/swagger';
import { CreateRoomShareDetailDto } from './create-room_share_detail.dto.js';

export class UpdateRoomShareDetailDto extends PartialType(CreateRoomShareDetailDto) {}
