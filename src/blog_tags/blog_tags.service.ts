import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateBlogTagDto } from './dto/create-blog_tag.dto.js';
import { UpdateBlogTagDto } from './dto/update-blog_tag.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type BlogTagsSafe = Prisma.blog_tagsGetPayload<{}>;

@Injectable()
export class BlogTagsService {
  create(createBlogTagDto: CreateBlogTagDto) {
    return prisma.blog_tags.create({
      data: createBlogTagDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<BlogTagsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.blog_tags.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.blog_tags.count(),
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
    const result = await prisma.blog_tags.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('BlogTag not found');
    }

    return result;
  }

  async update(
    id: number,
    updateBlogTagDto: UpdateBlogTagDto,
  ) {
    await this.findOne(id);

    return prisma.blog_tags.update({
      where: {
        id: id,
      },
      data: updateBlogTagDto as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.blog_tags.delete({
      where: {
        id: id,
      },
    });
  }
}
