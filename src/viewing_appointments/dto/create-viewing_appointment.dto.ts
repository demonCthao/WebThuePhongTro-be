import { Type } from 'class-transformer';
import {
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    Min,
} from 'class-validator';


export class CreateViewingAppointmentDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    room_id: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    seeker_id: number;

    @IsNotEmpty({ message: 'Thời gian hẹn không được để trống' })
    @IsDateString(
        {},
        { message: 'Thời gian hẹn không hợp lệ' },
    )
    scheduled_at: string;

    @IsOptional()
    @IsString()
    @Matches(/^0[0-9]{9}$/, {
        message: 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0',
    })
    contact_phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500, {
        message: 'Ghi chú không được vượt quá 500 ký tự',
    })
    seeker_note?: string;
}