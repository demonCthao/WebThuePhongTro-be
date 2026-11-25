import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtStrategy } from './strategies/jwt.strategy.js';
import { AuthService } from './auth.service.js';

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET');

                if (!secret) {
                    throw new Error('JWT_SECRET chưa được cấu hình');
                }

                return {
                    secret,
                    signOptions: {
                        expiresIn: '1h',
                    },
                };
            },
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    exports: [
        AuthService,
        JwtModule,
        PassportModule,
    ],
})
export class AuthModule { }