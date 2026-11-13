import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostsController } from './blog_posts.controller.js';
import { BlogPostsService } from './blog_posts.service.js';

describe('BlogPostsController', () => {
  let controller: BlogPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogPostsController],
      providers: [BlogPostsService],
    }).compile();

    controller = module.get<BlogPostsController>(BlogPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
