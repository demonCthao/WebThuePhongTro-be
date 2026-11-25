import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Request as ExpressRequest } from 'express';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import type { FindAllByCategoryQuery, FindAllByPriceQuery } from './rooms.service.js';
import { RoomsService } from './rooms.service.js';
import { createHash } from 'node:crypto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  create(
    @Body() createRoomDto: CreateRoomDto,

    @UploadedFiles()
    files: Express.Multer.File[],
    @CurrentUser('id') userId: string,
  ) {
    return this.roomsService.create(
      BigInt(userId),
      createRoomDto,
      files ?? [],
    );
  }

  @Get()
  findAll(@Query() query: FindAllByCategoryQuery) {
    return this.roomsService.findAll(query);
  }

  @Get("/recommended")
  recommended(@Query() query: FindAllByCategoryQuery) {
    return this.roomsService.recommended(query);
  }

  @Get("/by-price")
  findAllByPrice(@Query() query: FindAllByPriceQuery) {
    try {
      return this.roomsService.findAllByPrice(query);
    } catch (error) {
      console.error('Find rooms error:', error);
      throw error;
    }
  }

  @Get("/new")
  findNewRoomByTime() {
    return this.roomsService.findNewRoomByTime();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(BigInt(id));
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: ExpressRequest,
  ) {
    files?.map((file) => console.log(
      'BE HASH:',
      createHash('sha256')
        .update(file.buffer)
        .digest('hex'),
    ))

    return this.roomsService.update(BigInt(id), body, files ?? []);
  }

  @Post('test-upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
    }),
  )
  testUpload(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return files?.map((file) => ({
      name: file.originalname,
      size: file.size,
      header: file.buffer.subarray(0, 12).toString('hex'),
      hash: createHash('sha256')
        .update(file.buffer)
        .digest('hex'),
    }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(BigInt(id));
  }
}
