import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoommateRequestsService } from './roommate_requests.service.js';
import { CreateRoommateRequestDto } from './dto/create-roommate_request.dto.js';
import { UpdateRoommateRequestDto } from './dto/update-roommate_request.dto.js';

@Controller('roommate-requests')
export class RoommateRequestsController {
  constructor(private readonly roommateRequestsService: RoommateRequestsService) {}

  @Post()
  create(@Body() createRoommateRequestDto: CreateRoommateRequestDto) {
    return this.roommateRequestsService.create(createRoommateRequestDto);
  }

  @Get()
  findAll() {
    return this.roommateRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roommateRequestsService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoommateRequestDto: UpdateRoommateRequestDto) {
    return this.roommateRequestsService.update(BigInt(id), updateRoommateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roommateRequestsService.remove(BigInt(id));
  }
}
