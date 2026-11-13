import { PartialType } from '@nestjs/swagger';
import { CreateRoomModerationDto } from './create-room_moderation.dto.js';

export class UpdateRoomModerationDto extends PartialType(CreateRoomModerationDto) {}
