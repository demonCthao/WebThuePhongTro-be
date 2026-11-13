import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomReportsService } from './room_reports.service.js';
import { CreateRoomReportDto } from './dto/create-room_report.dto.js';
import { UpdateRoomReportDto } from './dto/update-room_report.dto.js';

@Controller('room-reports')
export class RoomReportsController {
  constructor(private readonly roomReportsService: RoomReportsService) {}

  @Post()
  create(@Body() createRoomReportDto: CreateRoomReportDto) {
    return this.roomReportsService.create(createRoomReportDto);
  }

  @Get()
  findAll() {
    return this.roomReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomReportsService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomReportDto: UpdateRoomReportDto) {
    return this.roomReportsService.update(BigInt(id), updateRoomReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomReportsService.remove(BigInt(id));
  }
}
