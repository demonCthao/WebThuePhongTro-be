import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateViewingAppointmentDto } from './dto/create-viewing_appointment.dto.js';
import { UpdateViewingAppointmentDto } from './dto/update-viewing_appointment.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type ViewingAppointmentsSafe = Prisma.viewing_appointmentsGetPayload<{}>;

@Injectable()
export class ViewingAppointmentsService {
  create(createViewingAppointmentDto: CreateViewingAppointmentDto) {
    return prisma.viewing_appointments.create({
      data: createViewingAppointmentDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<ViewingAppointmentsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.viewing_appointments.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.viewing_appointments.count(),
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
    const result = await prisma.viewing_appointments.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('ViewingAppointment not found');
    }

    return result;
  }

  async update(
    id: bigint,
    updateViewingAppointmentDto: UpdateViewingAppointmentDto,
  ) {
    await this.findOne(id);

    return prisma.viewing_appointments.update({
      where: {
        id: id,
      },
      data: updateViewingAppointmentDto as any,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.viewing_appointments.delete({
      where: {
        id: id,
      },
    });
  }
}
