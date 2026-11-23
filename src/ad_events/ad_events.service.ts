import { Injectable } from '@nestjs/common';
import { CreateAdEventDto } from './dto/create-ad_event.dto.js';
import { UpdateAdEventDto } from './dto/update-ad_event.dto.js';

@Injectable()
export class AdEventsService {
  create(createAdEventDto: CreateAdEventDto) {
    return 'This action adds a new adEvent';
  }

  findAll() {
    return `This action returns all adEvents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adEvent`;
  }

  update(id: number, updateAdEventDto: UpdateAdEventDto) {
    return `This action updates a #${id} adEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} adEvent`;
  }
}
