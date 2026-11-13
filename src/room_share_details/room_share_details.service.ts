import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateRoomShareDetailDto } from './dto/create-room_share_detail.dto.js';
import { UpdateRoomShareDetailDto } from './dto/update-room_share_detail.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type RoomShareDetailsSafe = Prisma.room_share_detailsGetPayload<{}>;

@Injectable()
export class RoomShareDetailsService {
  create(createRoomShareDetailDto: CreateRoomShareDetailDto) {
    return prisma.room_share_details.create({
      data: createRoomShareDetailDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<RoomShareDetailsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.room_share_details.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          room_id: 'desc',
        },
      }),

      prisma.room_share_details.count(),
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
    const result = await prisma.room_share_details.findUnique({
      where: {
        room_id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('RoomShareDetail not found');
    }

    return result;
  }

  async update(
    id: bigint,
    updateRoomShareDetailDto: UpdateRoomShareDetailDto,
  ) {
    await this.findOne(id);

    return prisma.room_share_details.update({
      where: {
        room_id: id,
      },
      data: updateRoomShareDetailDto as any,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.room_share_details.delete({
      where: {
        room_id: id,
      },
    });
  }
}
