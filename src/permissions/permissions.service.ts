import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreatePermissionDto } from './dto/create-permission.dto.js';
import { UpdatePermissionDto } from './dto/update-permission.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type PermissionsSafe = Prisma.permissionsGetPayload<{}>;

@Injectable()
export class PermissionsService {
  create(createPermissionDto: CreatePermissionDto) {
    return prisma.permissions.create({
      data: createPermissionDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<PermissionsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.permissions.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.permissions.count(),
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
    const result = await prisma.permissions.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('Permission not found');
    }

    return result;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ) {
    await this.findOne(id);

    return prisma.permissions.update({
      where: {
        id: id,
      },
      data: updatePermissionDto as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.permissions.delete({
      where: {
        id: id,
      },
    });
  }
}
