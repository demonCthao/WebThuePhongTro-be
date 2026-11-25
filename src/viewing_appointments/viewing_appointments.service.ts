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
    const { room_id, seeker_id, scheduled_at, ...data } = createViewingAppointmentDto;

    return prisma.viewing_appointments.create({
      data: {
        ...data,
        scheduled_at: new Date(`${scheduled_at}:00`),
        rooms: {
          connect: {
            id: Number(room_id),
          },
        },
        users_viewing_appointments_seeker_idTousers: {
          connect: {
            id: seeker_id,
          },
        },
      },
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

  async checkViewAppointmentWithRooms(room_id: number, user_id: bigint): Promise<Boolean> {
    const appointment = await prisma.viewing_appointments.findFirst({
      where: {
        room_id: BigInt(room_id),
        seeker_id: user_id,
      },
      select: {
        id: true,
      },
    });

    return !!appointment;
  }

  async findBySeekerId(
    seekerId: bigint,
  ): Promise<ViewingAppointmentsSafe[]> {
    return prisma.viewing_appointments.findMany({
      where: {
        seeker_id: seekerId,
      },
      include: {
        rooms: {
          include: {
            room_media: true,
            wards: true,
            provinces: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }
}
