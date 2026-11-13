import { Module } from '@nestjs/common';
import { BlogCategoriesService } from './blog_categories.service.js';
import { BlogCategoriesController } from './blog_categories.controller.js';

@Module({
  controllers: [BlogCategoriesController],
  providers: [BlogCategoriesService],
})
export class BlogCategoriesModule {}
