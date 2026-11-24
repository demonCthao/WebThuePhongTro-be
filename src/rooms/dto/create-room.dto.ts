import { Transform, Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRoomDto {
    @IsNumber()
    @Type(() => Number)
    category_id: number;

    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsString()
    description: string;

    @IsNumber()
    @Type(() => Number)
    price_monthly: number;

    @IsNumber()
    @Type(() => Number)
    area_m2: number;

    @IsNumber()
    @Type(() => Number)
    province_id: number;

    @IsNumber()
    @Type(() => Number)
    ward_id: number;

    @IsString()
    street_address: string;

    @IsString()
    full_address: string;

    @IsString()
    contact_name: string;

    @IsString()
    contact_phone: string;

    @IsOptional()
    @IsString()
    zalo_phone?: string | null;

    @IsOptional()
    @IsString()
    zalo_url?: string | null;

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    })
    @IsArray()
    @Type(() => Number)
    @IsInt({ each: true })
    amenity_ids?: number[];

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    latitude?: number | null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    longitude?: number | null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    water_price?: number | null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    electricity_price?: number | null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_people?: number | null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    floor_no?: number | null;

    @IsOptional()
    @IsDateString()
    available_from?: string | null;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    deposit?: number | null;
}