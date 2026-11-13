import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactEventsService } from './contact_events.service.js';
import { CreateContactEventDto } from './dto/create-contact_event.dto.js';
import { UpdateContactEventDto } from './dto/update-contact_event.dto.js';

@Controller('contact-events')
export class ContactEventsController {
  constructor(private readonly contactEventsService: ContactEventsService) {}

  @Post()
  create(@Body() createContactEventDto: CreateContactEventDto) {
    return this.contactEventsService.create(createContactEventDto);
  }

  @Get()
  findAll() {
    return this.contactEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactEventsService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactEventDto: UpdateContactEventDto) {
    return this.contactEventsService.update(BigInt(id), updateContactEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactEventsService.remove(BigInt(id));
  }
}
