import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly redis = new Redis(process.env.REDIS_URL!);

    getClient() {
        return this.redis;
    }

    async onModuleDestroy() {
        await this.redis.quit();
    }
}