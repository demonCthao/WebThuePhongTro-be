import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateProvinceAliasDto } from './dto/create-province_alias.dto.js';
import { UpdateProvinceAliasDto } from './dto/update-province_alias.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type ProvinceAliasesSafe = Prisma.province_aliasesGetPayload<{}>;

@Injectable()
export class ProvinceAliasesService {
  create(createProvinceAliasDto: CreateProvinceAliasDto) {
    return prisma.province_aliases.create({
      data: createProvinceAliasDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<ProvinceAliasesSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.province_aliases.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.province_aliases.count(),
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
    const result = await prisma.province_aliases.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('ProvinceAlias not found');
    }

    return result;
  }

  async update(
    id: number,
    updateProvinceAliasDto: UpdateProvinceAliasDto,
  ) {
    await this.findOne(id);

    return prisma.province_aliases.update({
      where: {
        id: id,
      },
      data: updateProvinceAliasDto as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.province_aliases.delete({
      where: {
        id: id,
      },
    });
  }
}
