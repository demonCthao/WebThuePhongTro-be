import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViewingAppointmentsService } from './viewing_appointments.service.js';
import { CreateViewingAppointmentDto } from './dto/create-viewing_appointment.dto.js';
import { UpdateViewingAppointmentDto } from './dto/update-viewing_appointment.dto.js';

@Controller('viewing-appointments')
export class ViewingAppointmentsController {
  constructor(private readonly viewingAppointmentsService: ViewingAppointmentsService) {}

  @Post()
  create(@Body() createViewingAppointmentDto: CreateViewingAppointmentDto) {
    return this.viewingAppointmentsService.create(createViewingAppointmentDto);
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
}
