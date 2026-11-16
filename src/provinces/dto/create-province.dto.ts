import {
    IsBoolean,
    IsInt,
    IsNumber,
    IsString,
} from 'class-validator';

export class CreateProvinceDto {
    @IsNumber()
    center_lat: number;

    @IsNumber()
    center_lng: number;

    @IsString()
    code: string;

    @IsString()
    full_name: string;

    @IsBoolean()
    is_active: boolean;

    @IsString()
    name: string;

    @IsString()
    name_search: string;

    @IsString()
    slug: string;

    @IsInt()
    sort_order: number;
}