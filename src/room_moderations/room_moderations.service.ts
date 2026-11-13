import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateRoomModerationDto } from './dto/create-room_moderation.dto.js';
import { UpdateRoomModerationDto } from './dto/update-room_moderation.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type RoomModerationsSafe = Prisma.room_moderationsGetPayload<{}>;

@Injectable()
export class RoomModerationsService {
  create(createRoomModerationDto: CreateRoomModerationDto) {
    return prisma.room_moderations.create({
      data: createRoomModerationDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<RoomModerationsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.room_moderations.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.room_moderations.count(),
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
    const result = await prisma.room_moderations.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('RoomModeration not found');
    }

    return result;
  }

  async update(
    id: bigint,
    updateRoomModerationDto: UpdateRoomModerationDto,
  ) {
    await this.findOne(id);

    return prisma.room_moderations.update({
      where: {
        id: id,
      },
      data: updateRoomModerationDto as any,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.room_moderations.delete({
      where: {
        id: id,
      },
    });
  }
}
