import { PartialType } from '@nestjs/swagger';
import { CreateRoommateRequestDto } from './create-roommate_request.dto.js';

export class UpdateRoommateRequestDto extends PartialType(CreateRoommateRequestDto) {}
