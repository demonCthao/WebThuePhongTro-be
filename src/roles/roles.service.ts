import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type RolesSafe = Prisma.rolesGetPayload<{}>;

@Injectable()
export class RolesService {
  create(createRoleDto: CreateRoleDto) {
    return prisma.roles.create({
      data: createRoleDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<RolesSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.roles.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.roles.count(),
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
    const result = await prisma.roles.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('Role not found');
    }

    return result;
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ) {
    await this.findOne(id);

    return prisma.roles.update({
      where: {
        id: id,
      },
      data: updateRoleDto as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.roles.delete({
      where: {
        id: id,
      },
    });
  }
}
