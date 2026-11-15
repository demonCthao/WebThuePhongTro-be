import { Type } from "class-transformer";
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from "class-validator";
import { wards_ward_type } from "../../generated/prisma/enums.js";

export class CreateWardDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    province_id: number;

    @IsString()
    @MaxLength(20)
    code: string;

    @IsString()
    @MaxLength(100)
    name: string;

    @IsString()
    @MaxLength(150)
    full_name: string;

    @IsEnum(wards_ward_type)
    ward_type: wards_ward_type;

    @IsString()
    @MaxLength(100)
    slug: string;

    @IsString()
    @MaxLength(100)
    name_search: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    center_lat?: number | null;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    center_lng?: number | null;

    @IsBoolean()
    is_active: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    merged_into?: number | null;
}