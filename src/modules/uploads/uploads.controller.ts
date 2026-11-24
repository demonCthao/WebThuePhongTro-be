
import {
    Controller,
    Post,
    Delete,
    Param,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    BadRequestException,
} from '@nestjs/common';

import {
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';

import { memoryStorage } from 'multer';
import type { Express } from 'express';
import { UploadsService } from './uploads.service.js';


const MAX_FILE_SIZE = 5 * 1024 * 1024;

const uploadOptions = {
    storage: memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
};

@Controller('uploads')
export class UploadsController {
    constructor(
        private readonly uploadsService: UploadsService,
    ) { }

    // Upload một ảnh
    @Post()
    @UseInterceptors(
        FileInterceptor('file', uploadOptions),
    )
    upload(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: MAX_FILE_SIZE,
                    }),
                    new FileTypeValidator({
                        fileType: /^image\/(jpeg|png|webp)$/,
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.uploadsService.uploadFile(file);
    }

    // Upload nhiều ảnh
    @Post('multiple')
    @UseInterceptors(
        FilesInterceptor('files', 10, uploadOptions),
    )
    async uploadMultiple(
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        if (!files?.length) {
            throw new BadRequestException(
                'Vui lòng chọn ít nhất một ảnh',
            );
        }

        return Promise.all(
            files.map((file) =>
                this.uploadsService.uploadFile(file),
            ),
        );
    }

    // Xóa ảnh
    @Delete(':filename')
    delete(
        @Param('filename') filename: string,
    ) {
        return this.uploadsService.deleteFile(filename);
    }
}
