import { Module } from '@nestjs/common';
import { BlogPostsService } from './blog_posts.service.js';
import { BlogPostsController } from './blog_posts.controller.js';

@Module({
  controllers: [BlogPostsController],
  providers: [BlogPostsService],
})
export class BlogPostsModule {}
