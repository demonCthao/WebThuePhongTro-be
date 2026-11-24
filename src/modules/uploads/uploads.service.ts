import {
    mkdir,
    writeFile,
    readFile,
    unlink,
} from 'node:fs/promises';

import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

import {
    join,
    extname,
    resolve,
} from 'node:path';

import { randomUUID } from 'node:crypto';
import { UploadedFileResult } from './uploads.types.js';


@Injectable()
export class UploadsService {
    private readonly uploadDir = resolve(
        process.cwd(),
        'uploads',
    );

    private readonly publicPath = '/uploads';

    private readonly allowedMimeTypes = new Map([
        ['image/jpeg', '.jpg'],
        ['image/png', '.png'],
        ['image/webp', '.webp'],
    ]);

    async uploadFile(
        file: Express.Multer.File,
    ): Promise<UploadedFileResult> {
        if (!file?.buffer || file.buffer.length === 0) {
            throw new BadRequestException('File không hợp lệ');
        }

        const extension = this.allowedMimeTypes.get(file.mimetype);

        if (!extension) {
            throw new BadRequestException(
                'Chỉ chấp nhận JPEG, PNG, WebP',
            );
        }

        if (file.size !== file.buffer.length) {
            throw new BadRequestException(
                'Dung lượng file không khớp với buffer',
            );
        }

        await mkdir(this.uploadDir, {
            recursive: true,
        });

        const filename = `${randomUUID()}${extension}`;
        const filePath = join(this.uploadDir, filename);

        console.log({
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            bufferLength: file.buffer.length,
            header: file.buffer.subarray(0, 12).toString("hex"),
        });

        await writeFile(filePath, file.buffer, {
            flag: 'wx',
        });

        // Kiểm tra lại file sau khi ghi
        const savedFile = await readFile(filePath);

        if (!savedFile.equals(file.buffer)) {
            await unlink(filePath);

            throw new InternalServerErrorException(
                'Dữ liệu file sau khi lưu không khớp',
            );
        }

        return {
            filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: `${this.publicPath}/${filename}`,
        };
    }

    async deleteFile(filename: string): Promise<void> {
        // Chỉ cho phép xóa file UUID do hệ thống tạo
        if (
            !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/i.test(
                filename,
            )
        ) {
            throw new BadRequestException('Tên file không hợp lệ');
        }

        const filePath = join(this.uploadDir, filename);

        try {
            await unlink(filePath);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                throw new NotFoundException('File không tồn tại');
            }

            throw error;
        }
    }
}
