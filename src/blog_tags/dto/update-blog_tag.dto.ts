import { PartialType } from '@nestjs/swagger';
import { CreateBlogTagDto } from './create-blog_tag.dto.js';

export class UpdateBlogTagDto extends PartialType(CreateBlogTagDto) {}
