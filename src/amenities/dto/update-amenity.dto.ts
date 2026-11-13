import { PartialType } from '@nestjs/swagger';
import { CreateAmenityDto } from './create-amenity.dto.js';

export class UpdateAmenityDto extends PartialType(CreateAmenityDto) {}
