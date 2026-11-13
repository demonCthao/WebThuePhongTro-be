import { Type } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    Min,
} from 'class-validator';

export class FindAllQuery {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageIndex?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize?: number = 10;
}