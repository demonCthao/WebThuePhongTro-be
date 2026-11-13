import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import { CreateProvinceDto } from './dto/create-province.dto.js';
import { UpdateProvinceDto } from './dto/update-province.dto.js';
import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type ProvincesSafe = Prisma.provincesGetPayload<{}>;

export interface FindAllProvinceQuery extends FindAllQuery {
  name?: string;
}

@Injectable()
export class ProvincesService {
  create(createProvinceDto: CreateProvinceDto) {
    return prisma.provinces.create({
      data: createProvinceDto as any,
    });
  }

  async findAll(): Promise<{ list: ProvincesSafe[] }> {
    const [list] = await prisma.$transaction([
      prisma.provinces.findMany({
        orderBy: {
          id: 'desc',
        },
      }),
    ]);

    return { list }
  }

  async findProvincesWithPagination({
      name = "",
      pageIndex = 1,
      pageSize = 10,
    }: FindAllProvinceQuery = {}): Promise<PaginatedResult<ProvincesSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.provinces.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.provinces.count(),
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
    const result = await prisma.provinces.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('Province not found');
    }

    return result;
  }

  async update(
    id: number,
    updateProvinceDto: UpdateProvinceDto,
  ) {
    await this.findOne(id);

    return prisma.provinces.update({
      where: {
        id: id,
      },
      data: updateProvinceDto as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.provinces.delete({
      where: {
        id: id,
      },
    });
  }
}
