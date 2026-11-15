import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateWardDto } from './dto/create-ward.dto.js';
import { UpdateWardDto } from './dto/update-ward.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type WardsSafe = Prisma.wardsGetPayload<{}>;

export interface FindAllWardQuery extends FindAllQuery {
  name?: string;
  code?: string
}

@Injectable()
export class WardsService {
  create(createWardDto: CreateWardDto) {
    return prisma.wards.create({
      data: createWardDto as any,
    });
  }

  async findAll({
    name = "",
    code = "",
    pageIndex = 1,
    pageSize = 10,
  }: FindAllWardQuery = {}): Promise<PaginatedResult<WardsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const where = {
      ...(name.trim()
        ? {
          full_name: {
            contains: name.trim(),
          },
        }
        : {}),

      ...(code.trim()
        ? {
          code: {
            contains: code.trim(),
          },
        }
        : {}),
    };

    const [list, total] = await prisma.$transaction([
      prisma.wards.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: "desc",
        },
      }),

      prisma.wards.count({
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

  async findOne(id: number) {
    const result = await prisma.wards.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('Ward not found');
    }

    return result;
  }

  async update(
    id: number,
    updateWardDto: UpdateWardDto,
  ) {
    await this.findOne(id);

    return prisma.wards.update({
      where: {
        id: id,
      },
      data: updateWardDto as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.wards.delete({
      where: {
        id: id,
      },
    });
  }
}
