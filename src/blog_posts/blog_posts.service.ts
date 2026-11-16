import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateBlogPostDto } from './dto/create-blog_post.dto.js';
import { UpdateBlogPostDto } from './dto/update-blog_post.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type BlogPostsSafe = Prisma.blog_postsGetPayload<{}>;

export interface FindAllBlogPostsQuery extends FindAllQuery {
  title?: string
}

@Injectable()
export class BlogPostsService {
  create(createBlogPostDto: CreateBlogPostDto) {
    return prisma.blog_posts.create({
      data: createBlogPostDto as any,
    });
  }


  async findAll({
    title = "",
    pageIndex = 1,
    pageSize = 10,
  }: FindAllBlogPostsQuery = {}): Promise<PaginatedResult<BlogPostsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const where: Prisma.blog_postsWhereInput = {
      ...(title.trim() && {
        title: {
          contains: title.trim(),
        },
      }),
    };

    const [list, total] = await prisma.$transaction([
      prisma.blog_posts.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: "desc",
        },
      }),

      prisma.blog_posts.count({
        where,
      }),
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
    const result = await prisma.blog_posts.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('BlogPost not found');
    }

    return result;
  }

  async update(
    id: bigint,
    updateBlogPostDto: UpdateBlogPostDto,
  ) {
    await this.findOne(id);

    return prisma.blog_posts.update({
      where: {
        id: id,
      },
      data: updateBlogPostDto as any,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.blog_posts.delete({
      where: {
        id: id,
      },
    });
  }
}
