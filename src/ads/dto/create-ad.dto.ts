import { Transform, Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    Min,
} from 'class-validator';
import { ads_status } from '../../generated/prisma/enums.js';

export class CreateAdDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    placement_id: number;

    @IsString()
    @MaxLength(150)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    alt_text?: string | null;

    @IsUrl({ require_protocol: true })
    @MaxLength(1000)
    link_url: string;

    @Transform(({ value }) => value === true || value === 'true')
    @IsBoolean()
    open_new_tab: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    advertiser_name?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    advertiser_phone?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    note?: string | null;

    @IsOptional()
    status?: ads_status;

    @IsOptional()
    starts_at?: string | null;

    @IsOptional()
    ends_at?: string | null;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    province_id?: number | null;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    sort_order?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    weight?: number;
}