import { Injectable } from '@nestjs/common';
import { CreateAdStatDto } from './dto/create-ad_stat.dto.js';
import { UpdateAdStatDto } from './dto/update-ad_stat.dto.js';

@Injectable()
export class AdStatsService {
  create(createAdStatDto: CreateAdStatDto) {
    return 'This action adds a new adStat';
  }

  findAll() {
    return `This action returns all adStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adStat`;
  }

  update(id: number, updateAdStatDto: UpdateAdStatDto) {
    return `This action updates a #${id} adStat`;
  }

  remove(id: number) {
    return `This action removes a #${id} adStat`;
  }
}
