import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateRoomMediaDto } from './dto/create-room_media.dto.js';
import { UpdateRoomMediaDto } from './dto/update-room_media.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type RoomMediaSafe = Prisma.room_mediaGetPayload<{}>;

@Injectable()
export class RoomMediaService {
  create(createRoomMediaDto: CreateRoomMediaDto) {
    return prisma.room_media.create({
      data: createRoomMediaDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<RoomMediaSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.room_media.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.room_media.count(),
    ]);

    return {
      list,
      total,
      pageIndex: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: bigint) {
    const result = await prisma.room_media.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('RoomMedia not found');
    }

    return result;
  }

  async update(
    id: bigint,
    updateRoomMediaDto: UpdateRoomMediaDto,
  ) {
    await this.findOne(id);

    return prisma.room_media.update({
      where: {
        id: id,
      },
      data: updateRoomMediaDto as any,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.room_media.delete({
      where: {
        id: id,
      },
    });
  }
}
