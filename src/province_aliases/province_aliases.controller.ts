import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProvinceAliasesService } from './province_aliases.service.js';
import { CreateProvinceAliasDto } from './dto/create-province_alias.dto.js';
import { UpdateProvinceAliasDto } from './dto/update-province_alias.dto.js';

@Controller('province-aliases')
export class ProvinceAliasesController {
  constructor(private readonly provinceAliasesService: ProvinceAliasesService) {}

  @Post()
  create(@Body() createProvinceAliasDto: CreateProvinceAliasDto) {
    return this.provinceAliasesService.create(createProvinceAliasDto);
  }

  @Get()
  findAll() {
    return this.provinceAliasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provinceAliasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProvinceAliasDto: UpdateProvinceAliasDto) {
    return this.provinceAliasesService.update(+id, updateProvinceAliasDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.provinceAliasesService.remove(+id);
  }
}
