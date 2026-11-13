import { Module } from '@nestjs/common';
import { UserRolesService } from './user_roles.service.js';
import { UserRolesController } from './user_roles.controller.js';

@Module({
  controllers: [UserRolesController],
  providers: [UserRolesService],
})
export class UserRolesModule {}
