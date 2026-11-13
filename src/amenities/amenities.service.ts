import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateAmenityDto } from './dto/create-amenity.dto.js';
import { UpdateAmenityDto } from './dto/update-amenity.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type AmenitiesSafe = Prisma.amenitiesGetPayload<{}>;

@Injectable()
export class AmenitiesService {
  create(createAmenityDto: CreateAmenityDto) {
    return prisma.amenities.create({
      data: createAmenityDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<AmenitiesSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.amenities.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.amenities.count(),
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
    const result = await prisma.amenities.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('Amenity not found');
    }

    return result;
  }

  async update(
    id: number,
    updateAmenityDto: UpdateAmenityDto,
  ) {
    await this.findOne(id);

    return prisma.amenities.update({
      where: {
        id: id,
      },
      data: updateAmenityDto as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.amenities.delete({
      where: {
        id: id,
      },
    });
  }
}
