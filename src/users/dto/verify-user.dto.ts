import {
    IsEnum,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
} from 'class-validator';

export enum OtpType {
    EMAIL = 'email',
    PHONE = 'phone',
}

export class SendOtpDto {
    @IsEnum(OtpType)
    type: OtpType;
}

export class VerifyOtpDto {
    @IsEnum(OtpType)
    type: OtpType;

    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    @Matches(/^\d{6}$/)
    otp: string;
}

