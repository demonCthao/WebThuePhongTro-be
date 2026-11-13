import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostTagsService } from './blog_post_tags.service.js';

describe('BlogPostTagsService', () => {
  let service: BlogPostTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogPostTagsService],
    }).compile();

    service = module.get<BlogPostTagsService>(BlogPostTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
