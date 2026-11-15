import { IsInt } from 'class-validator';

export class CreateRoomLikeDto {
    @IsInt()
    user_id: number;

    @IsInt()
    room_id: number;
}