import { PartialType } from '@nestjs/swagger';
import { CreateAdEventDto } from './create-ad_event.dto.js';

export class UpdateAdEventDto extends PartialType(CreateAdEventDto) {}
