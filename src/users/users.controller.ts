import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { FindAllUserQuery } from './users.service.js';
import { UsersService } from './users.service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { SendOtpDto, VerifyOtpDto } from './dto/verify-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: FindAllUserQuery) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(BigInt(id), updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(BigInt(id));
  }

  @Post("/login")
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto)
  }

  @Post("/register")
  register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto)
  }

  @Post('send-otp')
  sendOtp(
    @CurrentUser('id') userId: number,
    @Body() dto: SendOtpDto,
  ) {
    return this.usersService.sendOtp(userId, dto);
  }

  @Post('verify-otp')
  verifyOtp(
    @CurrentUser('id') userId: number,
    @Body() dto: VerifyOtpDto,
  ) {
    return this.usersService.verifyOtp(userId, dto);
  }


}
