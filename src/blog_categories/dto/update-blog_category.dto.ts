import { PartialType } from '@nestjs/swagger';
import { CreateBlogCategoryDto } from './create-blog_category.dto.js';

export class UpdateBlogCategoryDto extends PartialType(CreateBlogCategoryDto) {}
