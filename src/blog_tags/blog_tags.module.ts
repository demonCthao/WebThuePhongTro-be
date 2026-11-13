import { Module } from '@nestjs/common';
import { BlogTagsService } from './blog_tags.service.js';
import { BlogTagsController } from './blog_tags.controller.js';

@Module({
  controllers: [BlogTagsController],
  providers: [BlogTagsService],
})
export class BlogTagsModule {}
