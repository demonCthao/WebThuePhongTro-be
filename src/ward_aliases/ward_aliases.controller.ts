import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WardAliasesService } from './ward_aliases.service.js';
import { CreateWardAliasDto } from './dto/create-ward_alias.dto.js';
import { UpdateWardAliasDto } from './dto/update-ward_alias.dto.js';

@Controller('ward-aliases')
export class WardAliasesController {
  constructor(private readonly wardAliasesService: WardAliasesService) {}

  @Post()
  create(@Body() createWardAliasDto: CreateWardAliasDto) {
    return this.wardAliasesService.create(createWardAliasDto);
  }

  @Get()
  findAll() {
    return this.wardAliasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wardAliasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWardAliasDto: UpdateWardAliasDto) {
    return this.wardAliasesService.update(+id, updateWardAliasDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wardAliasesService.remove(+id);
  }
}
