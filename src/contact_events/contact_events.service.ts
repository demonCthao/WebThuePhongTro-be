import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateContactEventDto } from './dto/create-contact_event.dto.js';
import { UpdateContactEventDto } from './dto/update-contact_event.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type ContactEventsSafe = Prisma.contact_eventsGetPayload<{}>;

@Injectable()
export class ContactEventsService {
  create(createContactEventDto: CreateContactEventDto) {
    return prisma.contact_events.create({
      data: createContactEventDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<ContactEventsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.contact_events.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.contact_events.count(),
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
    const result = await prisma.contact_events.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('ContactEvent not found');
    }

    return result;
  }

  async update(
    id: bigint,
    updateContactEventDto: UpdateContactEventDto,
  ) {
    await this.findOne(id);

    return prisma.contact_events.update({
      where: {
        id: id,
      },
      data: updateContactEventDto as any,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.contact_events.delete({
      where: {
        id: id,
      },
    });
  }
}
