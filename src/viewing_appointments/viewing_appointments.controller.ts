import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ViewingAppointmentsService } from './viewing_appointments.service.js';
import { CreateViewingAppointmentDto } from './dto/create-viewing_appointment.dto.js';
import { UpdateViewingAppointmentDto } from './dto/update-viewing_appointment.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('viewing-appointments')
export class ViewingAppointmentsController {
  constructor(private readonly viewingAppointmentsService: ViewingAppointmentsService) { }

  @Post()
  create(@Body() createViewingAppointmentDto: CreateViewingAppointmentDto) {
    return this.viewingAppointmentsService.create(createViewingAppointmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-viewing-appointment')
  findBySeekerId(@CurrentUser('id') userId: string) {
    return this.viewingAppointmentsService.findBySeekerId(BigInt(userId))
  }

  @Get()
  findAll() {
    return this.viewingAppointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viewingAppointmentsService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViewingAppointmentDto: UpdateViewingAppointmentDto) {
    return this.viewingAppointmentsService.update(BigInt(id), updateViewingAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viewingAppointmentsService.remove(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/:room_id')
  checkViewAppointmentWithRooms(
    @Param('room_id', ParseIntPipe) room_id: number,
    @CurrentUser('id') userId: string,
  ) {
    console.log('JWT USER:', userId);

    return this.viewingAppointmentsService.checkViewAppointmentWithRooms(
      room_id,
      BigInt(userId),
    );
  }
}
