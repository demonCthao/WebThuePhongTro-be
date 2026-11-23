import { PartialType } from '@nestjs/swagger';
import { CreateAdStatDto } from './create-ad_stat.dto.js';

export class UpdateAdStatDto extends PartialType(CreateAdStatDto) {}
