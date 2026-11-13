import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateBlogCategoryDto } from './dto/create-blog_category.dto.js';
import { UpdateBlogCategoryDto } from './dto/update-blog_category.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type BlogCategoriesSafe = Prisma.blog_categoriesGetPayload<{}>;

@Injectable()
export class BlogCategoriesService {
  create(createBlogCategoryDto: CreateBlogCategoryDto) {
    return prisma.blog_categories.create({
      data: createBlogCategoryDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<BlogCategoriesSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.blog_categories.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.blog_categories.count(),
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
    const result = await prisma.blog_categories.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('BlogCategory not found');
    }

    return result;
  }

  async update(
    id: number,
    updateBlogCategoryDto: UpdateBlogCategoryDto,
  ) {
    await this.findOne(id);

    return prisma.blog_categories.update({
      where: {
        id: id,
      },
      data: updateBlogCategoryDto as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.blog_categories.delete({
      where: {
        id: id,
      },
    });
  }
}
