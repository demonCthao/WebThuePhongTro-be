import { PartialType } from '@nestjs/swagger';
import { CreateRolePermissionDto } from './create-role_permission.dto.js';

export class UpdateRolePermissionDto extends PartialType(CreateRolePermissionDto) {}
