import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateRoommateRequestDto } from './dto/create-roommate_request.dto.js';
import { UpdateRoommateRequestDto } from './dto/update-roommate_request.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type RoommateRequestsSafe = Prisma.roommate_requestsGetPayload<{}>;

@Injectable()
export class RoommateRequestsService {
  create(createRoommateRequestDto: CreateRoommateRequestDto) {
    return prisma.roommate_requests.create({
      data: createRoommateRequestDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<RoommateRequestsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.roommate_requests.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.roommate_requests.count(),
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
    const result = await prisma.roommate_requests.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('RoommateRequest not found');
    }

    return result;
  }

  async update(
    id: bigint,
    updateRoommateRequestDto: UpdateRoommateRequestDto,
  ) {
    await this.findOne(id);

    return prisma.roommate_requests.update({
      where: {
        id: id,
      },
      data: updateRoommateRequestDto as any,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.roommate_requests.delete({
      where: {
        id: id,
      },
    });
  }
}
