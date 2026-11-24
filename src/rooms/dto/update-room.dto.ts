import { PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto.js';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    @IsOptional()
    @IsString()
    keep_media_ids?: string;
}
