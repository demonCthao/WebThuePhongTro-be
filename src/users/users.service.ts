import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

import { createHmac, randomInt } from 'crypto';
import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { OtpType, SendOtpDto, VerifyOtpDto } from './dto/verify-user.dto.js';
import { RedisService } from './redis.service.js';
import { MailService } from './email.service.js';
import { SmsService } from './sms.service.js';

type UsersSafe = Prisma.usersGetPayload<{}>;

export interface FindAllUserQuery extends FindAllQuery {
  name?: string;
  email?: string;
  phone?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
  ) { }


  private readonly OTP_EXPIRES = 300; // 5 phút
  private readonly OTP_COOLDOWN = 60; // 60 giây
  private readonly OTP_MAX_ATTEMPTS = 5;

  private generateOtp() {
    return randomInt(100000, 1000000).toString();
  }

  create(createUserDto: CreateUserDto) {
    return prisma.users.create({
      data: createUserDto as any,
    });
  }

  async findAll({
    name = "",
    email = "",
    phone = "",
    pageIndex = 1,
    pageSize = 10,
  }: FindAllUserQuery = {}): Promise<PaginatedResult<UsersSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const where = {
      ...(name.trim()
        ? {
          full_name: {
            contains: name.trim(),
          },
        }
        : {}),

      ...(email.trim()
        ? {
          email: {
            contains: email.trim(),
          },
        }
        : {}),

      ...(phone.trim()
        ? {
          phone: {
            contains: phone.trim(),
          },
        }
        : {}),
    };

    const [list, total] = await prisma.$transaction([
      prisma.users.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: "desc",
        },
      }),

      prisma.users.count({
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
    const result = await prisma.users.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('User not found');
    }

    return result;
  }

  async update(
    id: bigint,
    updateUserDto: UpdateUserDto,
  ) {
    await this.findOne(id);

    return prisma.users.update({
      where: {
        id: id,
      },
      data: updateUserDto as any,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return prisma.users.delete({
      where: {
        id: id,
      },
    });
  }

  async login(loginDto: LoginDto) {
    try {
      console.log('[LOGIN] STEP 1: Start');

      const { username, password } = loginDto;
      const identifier = username.trim();

      const user = await prisma.users.findFirst({
        where: {
          OR: [
            { email: identifier },
            { phone: identifier },
          ],
        },
      });

      console.log('[LOGIN] STEP 2: User:', !!user);

      if (!user) {
        return {
          status: 401,
          message: 'Tài khoản hoặc mật khẩu không đúng'
        }
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );

      console.log('[LOGIN] STEP 3: Password:', isPasswordValid);

      if (!isPasswordValid) {
        return {
          status: 401,
          message: 'Tài khoản hoặc mật khẩu không đúng'
        }
      }

      const role = await prisma.user_roles.findFirst({
        where: {
          user_id: user.id,
        },
        include: {
          roles: true,
        },
      });

      console.log('[LOGIN] STEP 4: Role:', role);

      const payload = {
        sub: user.id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: role?.roles?.code ?? null,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      console.log('[LOGIN] STEP 5: JWT generated');

      const { password_hash, ...userInfo } = user;

      return {
        success: true,
        message: 'Login successful',
        access_token: accessToken,
        token_type: 'Bearer' as const,
        expires_in: 3600,
        user: {
          ...userInfo,
          id: userInfo.id.toString(),
        },
        status: 200
      };
    } catch (error) {
      console.error('[LOGIN ERROR]', error);
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      console.log('[REGISTER] STEP 1: Start');

      const { full_name, phone, email, password } = registerDto;

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = phone.trim();

      // STEP 2: Check existing user
      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [
            { email: normalizedEmail },
            { phone: normalizedPhone },
          ],
        },
        select: {
          email: true,
          phone: true,
        },
      });

      console.log('[REGISTER] STEP 2: Existing user:', !!existingUser);

      if (existingUser) {
        if (existingUser.email === normalizedEmail) {
          return {
            success: false,
            message: 'Email đã được sử dụng',
            status: 409,
          };
        }

        if (existingUser.phone === normalizedPhone) {
          return {
            success: false,
            message: 'Số điện thoại đã được sử dụng',
            status: 409,
          };
        }
      }

      // STEP 3: Hash password
      const password_hash = await bcrypt.hash(password, 12);

      console.log('[REGISTER] STEP 3: Password hashed');

      // STEP 4: Create user and assign role
      const user = await prisma.$transaction(async (tx) => {
        // Create user
        const newUser = await tx.users.create({
          data: {
            full_name: full_name.trim(),
            phone: normalizedPhone,
            email: normalizedEmail,
            password_hash,
            status: 'active',
          },
        });

        // Assign role
        await tx.user_roles.create({
          data: {
            user_id: newUser.id,
            role_id: 2,
          },
        });

        // Get user role
        const role = await tx.user_roles.findFirst({
          where: {
            user_id: newUser.id,
          },
          include: {
            roles: {
              select: {
                code: true,
              },
            },
          },
        });

        return {
          ...newUser,
          role: role?.roles?.code ?? null,
        };
      });

      console.log('[REGISTER] STEP 4: User created:', user.id.toString());

      // STEP 5: Generate JWT
      const payload = {
        sub: user.id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      console.log('[REGISTER] STEP 5: JWT generated');

      // STEP 6: Remove password_hash
      const {
        password_hash: _passwordHash,
        role: _role,
        ...userInfo
      } = user;

      return {
        success: true,
        message: 'Register successful',
        access_token: accessToken,
        token_type: 'Bearer' as const,
        expires_in: 3600,
        user: {
          ...userInfo,
          id: userInfo.id.toString(),
        },
        status: 200,
      };
    } catch (error) {
      console.error('[REGISTER ERROR]', error);

      // Handle duplicate email or phone
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return {
          success: false,
          message: 'Email hoặc số điện thoại đã được sử dụng',
          status: 409,
        };
      }

      throw error;
    }
  }

  private getOtpKey(userId: number, type: OtpType) {
    return `otp:${type}:${userId}`;
  }

  private getCooldownKey(userId: number, type: OtpType) {
    return `otp:cooldown:${type}:${userId}`;
  }

  private getAttemptKey(userId: number, type: OtpType) {
    return `otp:attempts:${type}:${userId}`;
  }

  private hashOtp(otp: string) {
    return createHmac('sha256', process.env.OTP_SECRET!)
      .update(otp)
      .digest('hex');
  }

  // Gửi OTP
  async sendOtp(userId: number, dto: SendOtpDto) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    const { type } = dto;

    const isEmail = type === OtpType.EMAIL;
    const destination = isEmail ? user.email : user.phone;
    const verifiedAt = isEmail
      ? user.email_verified_at
      : user.phone_verified_at;

    if (!destination) {
      throw new BadRequestException(
        isEmail ? 'Tài khoản chưa có email' : 'Tài khoản chưa có số điện thoại',
      );
    }

    if (verifiedAt) {
      throw new BadRequestException(
        isEmail ? 'Email đã được xác thực' : 'Số điện thoại đã được xác thực',
      );
    }

    const redis = this.redisService.getClient();

    const cooldownKey = this.getCooldownKey(userId, type);
    const otpKey = this.getOtpKey(userId, type);
    const attemptKey = this.getAttemptKey(userId, type);

    // Chỉ cho gửi lại sau 60 giây
    const canSend = await redis.set(
      cooldownKey,
      '1',
      'EX',
      this.OTP_COOLDOWN,
      'NX',
    );

    if (!canSend) {
      throw new BadRequestException(
        'Vui lòng chờ 60 giây trước khi gửi lại OTP',
      );
    }

    const otp = randomInt(100000, 1000000).toString();

    await redis.set(
      otpKey,
      this.hashOtp(otp),
      'EX',
      this.OTP_EXPIRES,
    );

    await redis.del(attemptKey);

    try {
      if (isEmail) {
        await this.mailService.sendVerificationOtp(destination, otp);
      } else {
        await this.smsService.sendVerificationOtp(destination, otp);
      }
    } catch (error) {
      await redis.del(otpKey, cooldownKey);
      throw error;
    }

    return {
      message: `Mã OTP đã được gửi đến ${isEmail ? 'email' : 'số điện thoại'}`,
      expiresIn: this.OTP_EXPIRES,
    };
  }

  // Xác thực OTP
  async verifyOtp(userId: number, dto: VerifyOtpDto) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    const { type, otp } = dto;

    const isEmail = type === OtpType.EMAIL;

    const verifiedAt = isEmail
      ? user.email_verified_at
      : user.phone_verified_at;

    if (verifiedAt) {
      throw new BadRequestException('Thông tin đã được xác thực');
    }

    const redis = this.redisService.getClient();

    const otpKey = this.getOtpKey(userId, type);
    const attemptKey = this.getAttemptKey(userId, type);

    const storedOtpHash = await redis.get(otpKey);

    if (!storedOtpHash) {
      throw new BadRequestException('OTP đã hết hạn hoặc không tồn tại');
    }

    const attempts = Number(await redis.get(attemptKey) || 0);

    if (attempts >= this.OTP_MAX_ATTEMPTS) {
      await redis.del(otpKey, attemptKey);
      throw new BadRequestException('Bạn đã nhập sai OTP quá số lần cho phép');
    }

    const inputOtpHash = this.hashOtp(otp);

    if (inputOtpHash !== storedOtpHash) {
      const newAttempts = await redis.incr(attemptKey);

      if (newAttempts === 1) {
        await redis.expire(attemptKey, this.OTP_EXPIRES);
      }

      if (newAttempts >= this.OTP_MAX_ATTEMPTS) {
        await redis.del(otpKey, attemptKey);
        throw new BadRequestException('Bạn đã nhập sai OTP quá số lần cho phép');
      }

      throw new BadRequestException('Mã OTP không chính xác');
    }

    // Xóa OTP sau khi xác thực thành công
    await redis.del(otpKey, attemptKey);

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: isEmail
        ? { email_verified_at: new Date() }
        : { phone_verified_at: new Date() },
      select: {
        id: true,
        email_verified_at: true,
        phone_verified_at: true,
      },
    });

    return {
      message: 'Xác thực thành công',
      user: updatedUser,
    };
  }
}
