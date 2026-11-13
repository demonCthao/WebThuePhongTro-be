import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateRoomReportDto } from './dto/create-room_report.dto.js';
import { UpdateRoomReportDto } from './dto/update-room_report.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type RoomReportsSafe = Prisma.room_reportsGetPayload<{}>;

@Injectable()
export class RoomReportsService {
  create(createRoomReportDto: CreateRoomReportDto) {
    return prisma.room_reports.create({
      data: createRoomReportDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<RoomReportsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.room_reports.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.room_reports.count(),
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
    const result = await prisma.room_reports.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('RoomReport not found');
    }

    return result;
  }

  async update(
    id: bigint,
    updateRoomReportDto: UpdateRoomReportDto,
  ) {
    await this.findOne(id);

    return prisma.room_reports.update({
      where: {
        id: id,
      },
      data: updateRoomReportDto as any,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.room_reports.delete({
      where: {
        id: id,
      },
    });
  }
}
