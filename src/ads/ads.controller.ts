import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AdsService } from './ads.service.js';
import type { FindAllAdsQuery } from './ads.service.js';
import { CreateAdDto } from './dto/create-ad.dto.js';
import { UpdateAdDto } from './dto/update-ad.dto.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) { }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 1, {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  create(
    @Body() createAdDto: CreateAdDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    return this.adsService.create(createAdDto, files);
  }

  @Get()
  getAdsForWeb() {
    return this.adsService.getAdsForWeb();
  }

  @Get("list")
  findAll(@Query() query: FindAllAdsQuery) {
    return this.adsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 1, {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateAdDto: UpdateAdDto,
    @UploadedFiles() files: Express.Multer.File[] = []
  ) {
    return this.adsService.update(+id, updateAdDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adsService.remove(+id);
  }
}
