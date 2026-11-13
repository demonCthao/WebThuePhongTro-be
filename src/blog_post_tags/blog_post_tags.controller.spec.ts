import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostTagsController } from './blog_post_tags.controller.js';
import { BlogPostTagsService } from './blog_post_tags.service.js';

describe('BlogPostTagsController', () => {
  let controller: BlogPostTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogPostTagsController],
      providers: [BlogPostTagsService],
    }).compile();

    controller = module.get<BlogPostTagsController>(BlogPostTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
