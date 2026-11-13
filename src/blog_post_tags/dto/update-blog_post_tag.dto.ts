import { PartialType } from '@nestjs/swagger';
import { CreateBlogPostTagDto } from './create-blog_post_tag.dto.js';

export class UpdateBlogPostTagDto extends PartialType(CreateBlogPostTagDto) {}
