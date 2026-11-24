import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateAdDto } from './create-ad.dto.js';

export class UpdateAdDto extends PartialType(CreateAdDto) {
    @IsOptional()
    @Transform(({ value }) => value === true || value === 'true')
    @IsBoolean()
    remove_image?: boolean;
}