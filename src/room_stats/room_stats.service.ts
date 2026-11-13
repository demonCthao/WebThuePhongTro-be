import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateRoomStatDto } from './dto/create-room_stat.dto.js';
import { UpdateRoomStatDto } from './dto/update-room_stat.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type RoomStatsSafe = Prisma.room_statsGetPayload<{}>;

@Injectable()
export class RoomStatsService {
  create(createRoomStatDto: CreateRoomStatDto) {
    return prisma.room_stats.create({
      data: createRoomStatDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<RoomStatsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.room_stats.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          room_id: 'desc',
        },
      }),

      prisma.room_stats.count(),
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
    const result = await prisma.room_stats.findUnique({
      where: {
        room_id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('RoomStat not found');
    }

    return result;
  }

  async update(
    id: bigint,
    updateRoomStatDto: UpdateRoomStatDto,
  ) {
    await this.findOne(id);

    return prisma.room_stats.update({
      where: {
        room_id: id,
      },
      data: updateRoomStatDto as any,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.room_stats.delete({
      where: {
        room_id: id,
      },
    });
  }
}
