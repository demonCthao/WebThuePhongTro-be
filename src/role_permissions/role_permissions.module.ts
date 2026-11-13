import { Module } from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service.js';
import { RolePermissionsController } from './role_permissions.controller.js';

@Module({
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService],
})
export class RolePermissionsModule {}
