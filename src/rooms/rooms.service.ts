import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';
import { UploadsService } from '../modules/uploads/uploads.service.js';
import { UploadedFileResult } from '../modules/uploads/uploads.types.js';

type RoomsSafe = Prisma.roomsGetPayload<{}>;

export interface FindAllByPriceQuery extends FindAllQuery {
  minPrice?: number;
  maxPrice?: number;
  province?: string;
  ward?: string;
  areaM2?: number;
  amenities?: string[];
}

export interface FindAllByCategoryQuery extends FindAllQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  province?: string;
  ward?: string;
  areaM2?: number;
  amenities?: string[];
}

@Injectable()
export class RoomsService {

  constructor(
    private readonly uploadsService: UploadsService,
  ) { }

  async create(
    ownerId: bigint,
    createRoomDto: CreateRoomDto,
    files: Express.Multer.File[] = [],
  ) {
    const uploadedFiles: UploadedFileResult[] = [];

    try {
      // 1. Kiểm tra số lượng ảnh
      if (files.length > 10) {
        throw new BadRequestException(
          'Chỉ được upload tối đa 10 ảnh',
        );
      }

      // 2. Kiểm tra và upload ảnh
      for (const file of files) {
        if (!file?.buffer || !file.size) {
          throw new BadRequestException(
            'File không hợp lệ',
          );
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new BadRequestException(
            'Dung lượng ảnh tối đa 5MB',
          );
        }

        if (
          !['image/jpeg', 'image/png', 'image/webp']
            .includes(file.mimetype)
        ) {
          throw new BadRequestException(
            'Chỉ chấp nhận JPEG, PNG, WebP',
          );
        }

        const uploaded =
          await this.uploadsService.uploadFile(file);

        uploadedFiles.push(uploaded);
      }

      // 3. Tạo room và room_media
      const roomData: Prisma.roomsUncheckedCreateInput = {
        ...createRoomDto,
        owner_id: ownerId,
        // Các trường địa chỉ bắt buộc
        province_id: createRoomDto.province_id,
        ward_id: createRoomDto.ward_id,
        street_address: createRoomDto.street_address,
        full_address: createRoomDto.full_address,

        room_media: {
          create: uploadedFiles.map((file, index) => ({
            kind: 'image',
            url: file.url,
            sort_order: index,
            is_cover: index === 0,
            cover_key: index === 0 ? 1 : null,
          })),
        },
      };

      const room = await prisma.rooms.create({
        data: roomData,
        include: {
          room_media: {
            orderBy: {
              sort_order: 'asc',
            },
          },
          room_categories: true,
        },
      });

      return room;
    } catch (error) {
      // 4. Database thất bại -> Xóa các file đã upload
      await Promise.allSettled(
        uploadedFiles.map((file) =>
          this.uploadsService.deleteFile(file.filename),
        ),
      );

      throw error;
    }
  }

  async findAllByPrice({
    pageIndex = 1,
    pageSize = 10,
    minPrice = 0,
    maxPrice,
    province = "",
    ward = "",
    areaM2 = 0
  }: FindAllByPriceQuery = {}): Promise<PaginatedResult<RoomsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const min = BigInt(minPrice);

    const wardFilter = {
      ...(province?.trim()
        ? {
          provinces: {
            is: {
              code: province.trim(),
            },
          },
        }
        : {}),
      ...(ward?.trim()
        ? {
          code: ward.trim(),
        }
        : {}),
    };

    const where = {
      ...(Number(areaM2) > 0
        ? {
          area_m2: {
            gte: Number(areaM2),
          },
        }
        : {}),

      price_monthly: {
        gte: min,
        ...(maxPrice != undefined && maxPrice != 0
          ? { lte: BigInt(maxPrice) }
          : {}),
      },

      ...(Object.keys(wardFilter).length > 0
        ? {
          wards: {
            is: wardFilter,
          },
        }
        : {}),
    };

    const [list, total] = await prisma.$transaction([
      prisma.rooms.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          room_media: true,
          provinces: true,
          wards: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.rooms.count({
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

  async findAll({
    pageIndex = 1,
    pageSize = 10,
    category = "",
    minPrice = 0,
    maxPrice,
    province = "",
    ward = "",
    areaM2 = 0,
    amenities = []
  }: FindAllByCategoryQuery = {}): Promise<PaginatedResult<RoomsSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);
    const min = BigInt(minPrice);
    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const amenityCodes = (
      Array.isArray(amenities)
        ? amenities
        : amenities
          ? [amenities]
          : []
    ).filter(Boolean);

    const wardFilter = {
      ...(province?.trim()
        ? {
          provinces: {
            is: {
              code: province.trim(),
            },
          },
        }
        : {}),
      ...(ward?.trim()
        ? {
          code: ward.trim(),
        }
        : {}),
    };

    const where = {
      ...(category?.trim()
        ? {
          room_categories: {
            is: {
              code: category.trim(),
            },
          },
        }
        : {}),
      ...(Number(areaM2) > 0
        ? {
          area_m2: {
            gte: Number(areaM2),
          },
        }
        : {}),

      price_monthly: {
        gte: min,
        ...(maxPrice != undefined && maxPrice != 0
          ? { lte: BigInt(maxPrice) }
          : {}),
      },

      ...(Object.keys(wardFilter).length > 0
        ? {
          wards: {
            is: wardFilter,
          },
        }
        : {}),
      ...(amenityCodes.length > 0
        ? {
          AND: amenityCodes.map((code) => ({
            room_amenities: {
              some: {
                amenities: {
                  is: {
                    code,
                  },
                },
              },
            },
          })),
        }
        : {}),
    };

    const [list, total] = await prisma.$transaction([
      prisma.rooms.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          room_media: true,
          provinces: true,
          wards: true,
          room_categories: true,
          room_amenities: {
            include: {
              amenities: true
            }
          }
        },
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.rooms.count({
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

  async findOne(id: bigint) {
    const result = await prisma.rooms.findUnique({
      where: {
        id: id,
      },
      include: {
        room_media: true,
        provinces: true,
        wards: true,
        room_amenities: {
          include: {
            amenities: true,
          },
        }
      },
    });

    if (!result) {
      throw new NotFoundException('Room not found');
    }

    return result;
  }


  async update(
    id: bigint,
    updateRoomDto: UpdateRoomDto,
    files: Express.Multer.File[] = [],
  ) {
    // 1. Kiểm tra phòng tồn tại
    await this.findOne(id);

    // 2. Lấy danh sách ảnh hiện tại
    const currentMedia = await prisma.room_media.findMany({
      where: {
        room_id: id,
      },
      orderBy: {
        sort_order: 'asc',
      },
    });

    // 3. Xác định ảnh cũ cần giữ lại
    const { keep_media_ids, ...roomFields } = updateRoomDto;

    let keepIds: bigint[];

    if (keep_media_ids === undefined) {
      // Không truyền danh sách => giữ toàn bộ ảnh cũ
      keepIds = currentMedia.map((item) => item.id);
    } else {
      try {
        const parsed = JSON.parse(keep_media_ids);

        if (
          !Array.isArray(parsed) ||
          !parsed.every(
            (item) =>
              typeof item === 'string' &&
              /^\d+$/.test(item),
          )
        ) {
          throw new Error('Invalid media IDs');
        }

        keepIds = parsed.map((item: string) => BigInt(item));
      } catch {
        throw new BadRequestException(
          'Danh sách ảnh giữ lại không hợp lệ',
        );
      }
    }

    // 4. Kiểm tra ID ảnh có thuộc phòng này không
    const currentIds = new Set(
      currentMedia.map((item) => item.id.toString()),
    );

    if (
      keepIds.some((mediaId) => !currentIds.has(mediaId.toString()))
    ) {
      throw new BadRequestException(
        'Danh sách ảnh chứa ID không hợp lệ',
      );
    }

    const retainedMedia = keepIds.map((mediaId) =>
      currentMedia.find((item) => item.id === mediaId)!,
    );

    // 5. Upload ảnh mới
    const uploadedMedia: {
      filename: string;
      url: string;
    }[] = [];

    try {
      for (const file of files) {
        const uploaded = await this.uploadsService.uploadFile(file);

        uploadedMedia.push({
          filename: uploaded.filename,
          url: uploaded.url,
        });
      }

      // 6. Cập nhật database bằng transaction
      await prisma.$transaction(async (tx) => {
        const dto = updateRoomDto;

        // 1. Chuẩn hóa dữ liệu và chỉ lấy các trường thuộc rooms
        const roomFields: Prisma.roomsUpdateInput = {
          // Thông tin cơ bản
          ...(dto.title !== undefined && {
            title: dto.title,
          }),

          ...(dto.slug !== undefined && {
            slug: dto.slug,
          }),

          ...(dto.description !== undefined && {
            description: dto.description,
          }),

          // Giá thuê
          ...(dto.price_monthly !== undefined && {
            price_monthly: BigInt(dto.price_monthly),
          }),

          // Tiền đặt cọc: giữ dạng string theo dữ liệu Prisma hiện tại
          ...(dto.deposit !== undefined && {
            deposit: dto.deposit,
          }),

          // Giá điện, nước
          ...(dto.electricity_price !== undefined && {
            electricity_price:
              dto.electricity_price === null
                ? null
                : Number(dto.electricity_price),
          }),

          ...(dto.water_price !== undefined && {
            water_price:
              dto.water_price === null
                ? null
                : Number(dto.water_price),
          }),

          // Diện tích
          ...(dto.area_m2 !== undefined && {
            area_m2: Number(dto.area_m2),
          }),

          // Số người tối đa
          ...(dto.max_people !== undefined && {
            max_people:
              dto.max_people === null
                ? null
                : Number(dto.max_people),
          }),

          // Tầng
          ...(dto.floor_no !== undefined && {
            floor_no:
              dto.floor_no === null
                ? null
                : Number(dto.floor_no),
          }),

          // Ngày có thể nhận phòng
          ...(dto.available_from !== undefined && {
            available_from: dto.available_from
              ? new Date(
                `${dto.available_from}T00:00:00.000Z`,
              )
              : null,
          }),

          // Địa chỉ chi tiết
          ...(dto.street_address !== undefined && {
            street_address: dto.street_address,
          }),

          ...(dto.full_address !== undefined && {
            full_address: dto.full_address,
          }),

          // Tọa độ: giữ dạng string theo dữ liệu Prisma hiện tại
          ...(dto.latitude !== undefined && {
            latitude: dto.latitude,
          }),

          ...(dto.longitude !== undefined && {
            longitude: dto.longitude,
          }),

          // Thông tin liên hệ
          ...(dto.contact_name !== undefined && {
            contact_name: dto.contact_name,
          }),

          ...(dto.contact_phone !== undefined && {
            contact_phone: dto.contact_phone,
          }),

          ...(dto.zalo_phone !== undefined && {
            zalo_phone: dto.zalo_phone,
          }),

          ...(dto.zalo_url !== undefined && {
            zalo_url: dto.zalo_url,
          }),

          // 2. Cập nhật danh mục
          ...(dto.category_id !== undefined && {
            room_categories: {
              connect: {
                id: Number(dto.category_id),
              },
            },
          }),

          // 3. Cập nhật tỉnh/thành phố
          ...(dto.province_id !== undefined && {
            provinces: {
              connect: {
                id: Number(dto.province_id),
              },
            },
          }),

          // 4. Cập nhật phường/xã
          ...(dto.ward_id !== undefined && {
            wards: {
              connect: {
                id: Number(dto.ward_id),
              },
            },
          }),
        };

        // 5. Cập nhật thông tin phòng
        await tx.rooms.update({
          where: { id },
          data: roomFields,
        });

        // 6. Đồng bộ tiện ích
        if (dto.amenity_ids !== undefined) {
          const parsedAmenityIds: number[] =
            typeof dto.amenity_ids === 'string'
              ? JSON.parse(dto.amenity_ids)
              : dto.amenity_ids;

          const amenityIds = [
            ...new Set(parsedAmenityIds.map(Number)),
          ];

          await tx.room_amenities.deleteMany({
            where: {
              room_id: id,
            },
          });

          if (amenityIds.length > 0) {
            await tx.room_amenities.createMany({
              data: amenityIds.map((amenityId) => ({
                room_id: id,
                amenity_id: amenityId,
              })),
              skipDuplicates: true,
            });
          }
        }

        // 7. Xóa ảnh cũ không được giữ lại
        await tx.room_media.deleteMany({
          where: {
            room_id: id,
            ...(keepIds.length > 0
              ? {
                id: {
                  notIn: keepIds,
                },
              }
              : {}),
          },
        });

        // 8. Reset ảnh đại diện
        await tx.room_media.updateMany({
          where: {
            room_id: id,
          },
          data: {
            is_cover: false,
            cover_key: null,
          },
        });

        // 9. Cập nhật ảnh cũ được giữ lại
        for (const [index, media] of retainedMedia.entries()) {
          await tx.room_media.update({
            where: {
              id: media.id,
            },
            data: {
              sort_order: index,
              is_cover: index === 0,
              cover_key: index === 0 ? 1 : null,
            },
          });
        }

        // 10. Tạo ảnh mới
        const newMediaData: Prisma.room_mediaCreateManyInput[] =
          uploadedMedia.map((file, index) => {
            const isCover =
              retainedMedia.length === 0 && index === 0;

            return {
              room_id: id,
              kind: 'image',
              url: file.url,
              sort_order: retainedMedia.length + index,
              is_cover: isCover,
              cover_key: isCover ? 1 : null,
            };
          });

        if (newMediaData.length > 0) {
          await tx.room_media.createMany({
            data: newMediaData,
          });
        }
      });
    } catch (error) {
      // Nếu upload hoặc transaction lỗi thì xóa file mới đã upload
      await Promise.all(
        uploadedMedia.map((file) =>
          this.uploadsService.deleteFile(file.filename),
        ),
      );

      throw error;
    }

    // 7. Xóa file vật lý của những ảnh cũ đã bị xóa
    const retainedIds = new Set(
      keepIds.map((mediaId) => mediaId.toString()),
    );

    const removedMedia = currentMedia.filter(
      (item) => !retainedIds.has(item.id.toString()),
    );

    await Promise.all(
      removedMedia.map(async (media) => {
        const filename = media.url.split('/').pop();

        if (filename) {
          try {
            await this.uploadsService.deleteFile(filename);
          } catch (error) {
            console.error('Cannot delete old room image:', error);
          }
        }
      }),
    );

    // 8. Trả về phòng sau khi cập nhật
    return prisma.rooms.findUnique({
      where: { id },
      include: {
        room_media: {
          orderBy: {
            sort_order: 'asc',
          },
        },
      },
    });
  }


  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.rooms.delete({
      where: {
        id: id,
      },
    });
  }

  async findNewRoomByTime(): Promise<RoomsSafe[]> {
    return prisma.rooms.findMany({
      take: 5,
      include: {
        room_media: true,
        provinces: true,
        wards: true
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async recommended({
    category = "",
  }: FindAllByCategoryQuery = {}): Promise<RoomsSafe[]> {
    return await prisma.rooms.findMany({
      where: {
        status: "approved",
        room_categories: {
          is: {
            code: category.trim(),
          },
        },
        deleted_at: null,
        OR: [
          { expires_at: null },
          { expires_at: { gt: new Date() } },
        ],
      },
      include: {
        room_stats: true,
        room_media: true,
        room_categories: true,
        provinces: true,
        wards: true,
      },
      orderBy: [
        { vip_level: "desc" },
        { published_at: "desc" },
      ],
      take: 3,
    });
  }
}
