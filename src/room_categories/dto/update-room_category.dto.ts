import { PartialType } from '@nestjs/swagger';
import { CreateRoomCategoryDto } from './create-room_category.dto.js';

export class UpdateRoomCategoryDto extends PartialType(CreateRoomCategoryDto) {}
