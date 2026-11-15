
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';
import { CreateRoomLikeDto } from './dto/create-room_like.dto.js';

type RoomLikeSafe = Prisma.room_likesGetPayload<{}>;

type RoomLikeWithRoom = Prisma.room_likesGetPayload<{
  include: {
    rooms: true;
  };
}>;

export interface FindAllRoomLikesQuery extends FindAllQuery {
  user_id?: number;
  room_id?: number;
}

@Injectable()
export class RoomLikesService {
  // Thêm phòng yêu thích
  async create(createRoomLikeDto: CreateRoomLikeDto) {
    const { user_id, room_id } = createRoomLikeDto;

    const existingLike = await this.checkLike(user_id, room_id);

    if (existingLike) {
      return existingLike;
    }

    return prisma.room_likes.create({
      data: {
        user_id,
        room_id,
      },
    });
  }

  // Lấy tất cả lượt yêu thích
  async findAll(): Promise<{ list: RoomLikeSafe[] }> {
    const [list] = await prisma.$transaction([
      prisma.room_likes.findMany({
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    return { list };
  }

  // Lấy danh sách yêu thích có phân trang
  async findRoomLikesWithPagination({
    user_id,
    room_id,
    pageIndex = 1,
    pageSize = 10,
  }: FindAllRoomLikesQuery = {}): Promise<PaginatedResult<RoomLikeSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const where: Prisma.room_likesWhereInput = {
      ...(user_id != null ? { user_id: Number(user_id) } : {}),
      ...(room_id != null ? { room_id: Number(room_id) } : {}),
    };

    const [list, total] = await prisma.$transaction([
      prisma.room_likes.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),

      prisma.room_likes.count({
        where,
      }),
    ]);

    return {
      list,
      total,
      pageIndex: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy lượt yêu thích theo user_id và room_id
  async findOne(userId: number, roomId: number) {
    const result = await prisma.room_likes.findUnique({
      where: {
        user_id_room_id: {
          user_id: userId,
          room_id: roomId,
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Room like not found');
    }

    return result;
  }

  // Lấy danh sách phòng mà user đã yêu thích
  async findByUserId(userId: number): Promise<RoomLikeWithRoom[]> {
    return prisma.room_likes.findMany({
      where: {
        user_id: userId,
      },
      include: {
        rooms: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // Kiểm tra user đã yêu thích phòng chưa
  async checkLike(userId: number, roomId: number) {
    return prisma.room_likes.findUnique({
      where: {
        user_id_room_id: {
          user_id: userId,
          room_id: roomId,
        },
      },
    });
  }

  // Bỏ yêu thích phòng
  async remove(userId: number, roomId: number) {
    await this.findOne(userId, roomId);

    return prisma.room_likes.delete({
      where: {
        user_id_room_id: {
          user_id: userId,
          room_id: roomId,
        },
      },
    });
  }
}
