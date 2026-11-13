import { Module } from '@nestjs/common';
import { BlogPostTagsService } from './blog_post_tags.service.js';
import { BlogPostTagsController } from './blog_post_tags.controller.js';

@Module({
  controllers: [BlogPostTagsController],
  providers: [BlogPostTagsService],
})
export class BlogPostTagsModule {}
