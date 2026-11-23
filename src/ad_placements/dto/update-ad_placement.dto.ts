import { PartialType } from '@nestjs/swagger';
import { CreateAdPlacementDto } from './create-ad_placement.dto.js';

export class UpdateAdPlacementDto extends PartialType(CreateAdPlacementDto) {}
