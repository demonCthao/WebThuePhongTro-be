import { Test, TestingModule } from '@nestjs/testing';
import { BlogCategoriesController } from './blog_categories.controller.js';
import { BlogCategoriesService } from './blog_categories.service.js';

describe('BlogCategoriesController', () => {
  let controller: BlogCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogCategoriesController],
      providers: [BlogCategoriesService],
    }).compile();

    controller = module.get<BlogCategoriesController>(BlogCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
