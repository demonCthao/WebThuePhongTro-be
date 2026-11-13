import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateWardAliasDto } from './dto/create-ward_alias.dto.js';
import { UpdateWardAliasDto } from './dto/update-ward_alias.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type WardAliasesSafe = Prisma.ward_aliasesGetPayload<{}>;

@Injectable()
export class WardAliasesService {
  create(createWardAliasDto: CreateWardAliasDto) {
    return prisma.ward_aliases.create({
      data: createWardAliasDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<WardAliasesSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.ward_aliases.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.ward_aliases.count(),
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
    const result = await prisma.ward_aliases.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('WardAlias not found');
    }

    return result;
  }

  async update(
    id: number,
    updateWardAliasDto: UpdateWardAliasDto,
  ) {
    await this.findOne(id);

    return prisma.ward_aliases.update({
      where: {
        id: id,
      },
      data: updateWardAliasDto as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.ward_aliases.delete({
      where: {
        id: id,
      },
    });
  }
}
