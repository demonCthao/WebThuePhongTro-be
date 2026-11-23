import { Injectable } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto.js';
import { UpdateAdDto } from './dto/update-ad.dto.js';
import { prisma } from '../lib/prisma.js';

@Injectable()
export class AdsService {
  create(createAdDto: CreateAdDto) {
    return 'This action adds a new ad';
  }

  findAll() {
    const now = new Date();

    return prisma.ads.findMany({
      where: {
        deleted_at: null,
        AND: [
          {
            OR: [
              { starts_at: null },
              { starts_at: { lte: now } },
            ],
          },
          {
            OR: [
              { ends_at: null },
              { ends_at: { gte: now } },
            ],
          },
        ],
      },
      include: {
        ad_events: true,
        ad_placements: true,
        ad_stats: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} ad`;
  }

  update(id: number, updateAdDto: UpdateAdDto) {
    return `This action updates a #${id} ad`;
  }

  remove(id: number) {
    return `This action removes a #${id} ad`;
  }
}
