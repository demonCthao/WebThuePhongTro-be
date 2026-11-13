import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateRoomCategoryDto } from './dto/create-room_category.dto.js';
import { UpdateRoomCategoryDto } from './dto/update-room_category.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type RoomCategoriesSafe = Prisma.room_categoriesGetPayload<{}>;

@Injectable()
export class RoomCategoriesService {
  create(createRoomCategoryDto: CreateRoomCategoryDto) {
    return prisma.room_categories.create({
      data: createRoomCategoryDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<RoomCategoriesSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.room_categories.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.room_categories.count(),
    ]);

    return {
      list,
      total,
      pageIndex: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const result = await prisma.room_categories.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('RoomCategory not found');
    }

    return result;
  }

  async update(
    id: number,
    updateRoomCategoryDto: UpdateRoomCategoryDto,
  ) {
    await this.findOne(id);

    return prisma.room_categories.update({
      where: {
        id: id,
      },
      data: updateRoomCategoryDto as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.room_categories.delete({
      where: {
        id: id,
      },
    });
  }
}
