import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogPostTagsService } from './blog_post_tags.service.js';
import { CreateBlogPostTagDto } from './dto/create-blog_post_tag.dto.js';
import { UpdateBlogPostTagDto } from './dto/update-blog_post_tag.dto.js';

@Controller('blog-post-tags')
export class BlogPostTagsController {
  constructor(private readonly blogPostTagsService: BlogPostTagsService) {}

  @Post()
  create(@Body() createBlogPostTagDto: CreateBlogPostTagDto) {
    return this.blogPostTagsService.create(createBlogPostTagDto);
  }

  @Get()
  findAll() {
    return this.blogPostTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogPostTagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogPostTagDto: UpdateBlogPostTagDto) {
    return this.blogPostTagsService.update(+id, updateBlogPostTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogPostTagsService.remove(+id);
  }
}
