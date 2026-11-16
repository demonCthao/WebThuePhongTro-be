import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BlogPostsService } from './blog_posts.service.js';
import type { FindAllBlogPostsQuery } from './blog_posts.service.js';
import { CreateBlogPostDto } from './dto/create-blog_post.dto.js';
import { UpdateBlogPostDto } from './dto/update-blog_post.dto.js';

@Controller('blog-posts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Post()
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogPostsService.create(createBlogPostDto);
  }

  @Get()
  findAll(@Query() query: FindAllBlogPostsQuery) {
    return this.blogPostsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogPostsService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogPostsService.update(BigInt(id), updateBlogPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogPostsService.remove(BigInt(id));
  }
}
