import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

type UsersSafe = Prisma.usersGetPayload<{}>;

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  create(createUserDto: CreateUserDto) {
    return prisma.users.create({
      data: createUserDto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<UsersSafe>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.users.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),

      prisma.users.count(),
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


}
