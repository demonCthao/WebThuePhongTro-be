import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type RoomsSafe = Prisma.roomsGetPayload<{}>;

export interface FindAllByPriceQuery extends FindAllQuery {
  minPrice?: number;
  maxPrice?: number;
  province?: string;
  ward?: string;
  areaM2?: number;
}

export interface FindAllByCategoryQuery extends FindAllQuery {
  category?: string;
}

@Injectable()
export class RoomsService {
  create(createRoomDto: CreateRoomDto) {
    return prisma.rooms.create({
      data: createRoomDto as any,
    });
  }

  async findAllByPrice({
    pageIndex = 1,
    pageSize = 10,
    minPrice = 0,
    maxPrice,
    province = "",
    ward = "",
    areaM2 = 0
  }: FindAllByPriceQuery = {}): Promise<PaginatedResult<RoomsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const min = BigInt(minPrice);

    const wardFilter = {
      ...(province?.trim()
        ? {
          provinces: {
            is: {
              code: province.trim(),
            },
          },
        }
        : {}),
      ...(ward?.trim()
        ? {
          code: ward.trim(),
        }
        : {}),
    };

    const where = {
      ...(Number(areaM2) > 0
        ? {
          area_m2: {
            gte: Number(areaM2),
          },
        }
        : {}),

      price_monthly: {
        gte: min,
        ...(maxPrice != undefined && maxPrice != 0
          ? { lte: BigInt(maxPrice) }
          : {}),
      },

      ...(Object.keys(wardFilter).length > 0
        ? {
          wards: {
            is: wardFilter,
          },
        }
        : {}),
    };

    const [list, total] = await prisma.$transaction([
      prisma.rooms.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          room_media: true,
          provinces: true,
          wards: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.rooms.count({
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

  async findAll({
    pageIndex = 1,
    pageSize = 10,
    category = "",
  }: FindAllByCategoryQuery = {}): Promise<PaginatedResult<RoomsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const where = {
      ...(category?.trim()
        ? {
          room_categories: {
            is: {
              code: category.trim(),
            },
          },
        }
        : {}),
    };

    const [list, total] = await prisma.$transaction([
      prisma.rooms.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          room_media: true,
          provinces: true,
          wards: true,
          room_categories: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.rooms.count({
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

  async findOne(id: bigint) {
    const result = await prisma.rooms.findUnique({
      where: {
        id: id,
      },
      include: {
        room_media: true,
        provinces: true,
        wards: true,
        room_amenities: {
          include: {
            amenities: true,
          },
        }
      },
    });

    if (!result) {
      throw new NotFoundException('Room not found');
    }

    return result;
  }

  async update(
    id: bigint,
    updateRoomDto: UpdateRoomDto,
  ) {
    await this.findOne(id);

    return prisma.rooms.update({
      where: {
        id: id,
      },
      data: updateRoomDto as any,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.rooms.delete({
      where: {
        id: id,
      },
    });
  }

  async findNewRoomByTime(): Promise<RoomsSafe[]> {
    return prisma.rooms.findMany({
      take: 5,
      include: {
        room_media: true,
        provinces: true,
        wards: true
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
