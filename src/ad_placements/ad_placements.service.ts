import { Injectable } from '@nestjs/common';
import { CreateAdPlacementDto } from './dto/create-ad_placement.dto.js';
import { UpdateAdPlacementDto } from './dto/update-ad_placement.dto.js';

@Injectable()
export class AdPlacementsService {
  create(createAdPlacementDto: CreateAdPlacementDto) {
    return 'This action adds a new adPlacement';
  }

  findAll() {
    return `This action returns all adPlacements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adPlacement`;
  }

  update(id: number, updateAdPlacementDto: UpdateAdPlacementDto) {
    return `This action updates a #${id} adPlacement`;
  }

  remove(id: number) {
    return `This action removes a #${id} adPlacement`;
  }
}
