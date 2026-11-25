import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service.js';
import { RoomsController } from './rooms.controller.js';
import { UploadsModule } from '../modules/uploads/uploads.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    UploadsModule,
    AuthModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule { }
