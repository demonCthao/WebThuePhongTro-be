import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async generateAccessToken(user: {
        id: bigint;
        email: string;
        full_name: string;
        role: string;
    }) {
        const payload = {
            sub: user.id.toString(),
            email: user.email,
            full_name: user.full_name,
            role: user.role,
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}