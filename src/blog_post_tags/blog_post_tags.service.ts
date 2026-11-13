import { Injectable } from '@nestjs/common';
import { CreateBlogPostTagDto } from './dto/create-blog_post_tag.dto.js';
import { UpdateBlogPostTagDto } from './dto/update-blog_post_tag.dto.js';

@Injectable()
export class BlogPostTagsService {
  create(createBlogPostTagDto: CreateBlogPostTagDto) {
    return 'This action adds a new blogPostTag';
  }

  findAll() {
    return `This action returns all blogPostTags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogPostTag`;
  }

  update(id: number, updateBlogPostTagDto: UpdateBlogPostTagDto) {
    return `This action updates a #${id} blogPostTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogPostTag`;
  }
}
