import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto.js';
import { UpdateAdDto } from './dto/update-ad.dto.js';
import { prisma } from '../lib/prisma.js';
import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';
import { Prisma } from '../generated/prisma/client.js';
import { UploadsService } from '../modules/uploads/uploads.service.js';

export interface FindAllAdsQuery extends FindAllQuery {
  title?: string;
}

type AdsSafe = Prisma.adsGetPayload<{}>;

@Injectable()
export class AdsService {
  constructor(
    private readonly uploadsService: UploadsService,
  ) { }

  private parseDate(value: string | null | undefined) {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(
        'Ngày quảng cáo không hợp lệ',
      );
    }

    return date;
  }

  async create(
    createAdDto: CreateAdDto,
    files: Express.Multer.File[] = [],
  ) {
    // 1. Kiểm tra file
    if (!files.length) {
      throw new BadRequestException(
        'Vui lòng tải lên ảnh quảng cáo',
      );
    }

    const uploadedFiles: {
      filename: string;
      url: string;
    }[] = [];

    try {
      // 2. Upload ảnh
      const uploaded = await this.uploadsService.uploadFile(
        files[0],
      );

      uploadedFiles.push({
        filename: uploaded.filename,
        url: uploaded.url,
      });

      // 3. Tạo quảng cáo và thống kê
      const ad = await prisma.$transaction(async (tx) => {
        const createdAd = await tx.ads.create({
          data: {
            placement_id: Number(createAdDto.placement_id),
            title: createAdDto.title,

            image_url: uploaded.url,
            image_mobile_url: null,

            alt_text: createAdDto.alt_text ?? null,
            link_url: createAdDto.link_url,
            open_new_tab:
              createAdDto.open_new_tab ?? true,

            advertiser_name:
              createAdDto.advertiser_name ?? null,

            advertiser_phone:
              createAdDto.advertiser_phone ?? null,

            note: createAdDto.note ?? null,

            status: createAdDto.status ?? 'draft',

            starts_at: this.parseDate(
              createAdDto.starts_at,
            ),

            ends_at: this.parseDate(
              createAdDto.ends_at,
            ),

            province_id:
              createAdDto.province_id == null
                ? null
                : Number(createAdDto.province_id),

            sort_order: Number(
              createAdDto.sort_order ?? 0,
            ),

            weight: Number(createAdDto.weight ?? 1),
          },
        });

        await tx.ad_stats.create({
          data: {
            ad_id: createdAd.id,
          },
        });

        return createdAd;
      });

      // 4. Trả về dữ liệu
      return prisma.ads.findUnique({
        where: {
          id: ad.id,
        },
        include: {
          ad_placements: true,
          ad_stats: true,
          provinces: true,
        },
      });
    } catch (error) {
      // 5. Xóa file nếu có lỗi
      await Promise.all(
        uploadedFiles.map((file) =>
          this.uploadsService.deleteFile(file.filename),
        ),
      );

      throw error;
    }
  }

  async findAll({
    title = "",
    pageIndex = 1,
    pageSize = 10,
  }: FindAllAdsQuery = {}): Promise<PaginatedResult<AdsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const now = new Date();

    const where: Prisma.adsWhereInput = {
      deleted_at: null,

      ...(title.trim() && {
        title: {
          contains: title.trim(),
        },
      }),

      AND: [
        {
          OR: [
            { starts_at: null },
            { starts_at: { lte: now } },
          ],
        },
        {
          OR: [
            { ends_at: null },
            { ends_at: { gte: now } },
          ],
        },
      ],
    };

    const [list, total] = await prisma.$transaction([
      prisma.ads.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          ad_events: true,
          ad_placements: true,
          ad_stats: true,
        },
        orderBy: {
          created_at: "desc",
        },
      }),

      prisma.ads.count({
        where,
      }),
    ]);

    return {
      list,
      total,
      pageIndex: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  getAdsForWeb() {
    const now = new Date();

    return prisma.ads.findMany({
      where: {
        deleted_at: null,
        AND: [
          {
            OR: [
              { starts_at: null },
              { starts_at: { lte: now } },
            ],
          },
          {
            OR: [
              { ends_at: null },
              { ends_at: { gte: now } },
            ],
          },
        ],
      },
      include: {
        ad_events: true,
        ad_placements: true,
        ad_stats: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} ad`;
  }

  async update(
    id: number,
    updateAdDto: UpdateAdDto,
    files: Express.Multer.File[] = [],
  ) {
    // 1. Kiểm tra quảng cáo tồn tại
    const currentAd = await prisma.ads.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!currentAd) {
      throw new NotFoundException(
        'Không tìm thấy quảng cáo',
      );
    }

    const uploadedFiles: {
      filename: string;
      url: string;
    }[] = [];

    let newImageUrl: string | undefined;

    try {
      // 2. Upload ảnh mới nếu có
      if (files.length > 0) {
        const uploaded = await this.uploadsService.uploadFile(
          files[0],
        );

        newImageUrl = uploaded.url;

        uploadedFiles.push({
          filename: uploaded.filename,
          url: uploaded.url,
        });
      }

      // 3. Chuẩn hóa dữ liệu update
      const dto = updateAdDto;

      const adFields: Prisma.adsUpdateInput = {
        ...(dto.placement_id !== undefined && {
          placement_id: Number(dto.placement_id),
        }),

        ...(dto.title !== undefined && {
          title: dto.title,
        }),

        ...(newImageUrl !== undefined && {
          image_url: newImageUrl,
          image_mobile_url: newImageUrl,
        }),

        ...(dto.alt_text !== undefined && {
          alt_text: dto.alt_text,
        }),

        ...(dto.link_url !== undefined && {
          link_url: dto.link_url,
        }),

        ...(dto.open_new_tab !== undefined && {
          open_new_tab: dto.open_new_tab,
        }),

        ...(dto.advertiser_name !== undefined && {
          advertiser_name: dto.advertiser_name,
        }),

        ...(dto.advertiser_phone !== undefined && {
          advertiser_phone: dto.advertiser_phone,
        }),

        ...(dto.note !== undefined && {
          note: dto.note,
        }),

        ...(dto.status !== undefined && {
          status: dto.status,
        }),

        ...(dto.starts_at !== undefined && {
          starts_at: this.parseDate(dto.starts_at),
        }),

        ...(dto.ends_at !== undefined && {
          ends_at: this.parseDate(dto.ends_at),
        }),

        ...(dto.province_id !== undefined && {
          province_id:
            dto.province_id === null
              ? null
              : Number(dto.province_id),
        }),

        ...(dto.sort_order !== undefined && {
          sort_order: Number(dto.sort_order),
        }),

        ...(dto.weight !== undefined && {
          weight: Number(dto.weight),
        }),
      };

      // 4. Cập nhật database
      await prisma.ads.update({
        where: {
          id,
        },
        data: adFields,
      });
    } catch (error) {
      // 5. Xóa file mới nếu update lỗi
      await Promise.all(
        uploadedFiles.map((file) =>
          this.uploadsService.deleteFile(file.filename),
        ),
      );

      throw error;
    }

    // 6. Xóa ảnh cũ nếu đã thay ảnh mới
    if (newImageUrl !== undefined) {
      const oldFilename = currentAd.image_url
        .split('?')[0]
        .split('/')
        .pop();

      if (oldFilename) {
        try {
          await this.uploadsService.deleteFile(oldFilename);
        } catch (error) {
          console.error(
            'Cannot delete old ad image:',
            error,
          );
        }
      }
    }

    // 7. Trả về quảng cáo sau khi cập nhật
    return prisma.ads.findUnique({
      where: {
        id,
      },
      include: {
        ad_placements: true,
        ad_stats: true,
        provinces: true,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} ad`;
  }
}
