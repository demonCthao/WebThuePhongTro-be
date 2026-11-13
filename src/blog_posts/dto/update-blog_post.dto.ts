import { PartialType } from '@nestjs/swagger';
import { CreateBlogPostDto } from './create-blog_post.dto.js';

export class UpdateBlogPostDto extends PartialType(CreateBlogPostDto) {}
