
import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);

    constructor(
        private readonly httpService: HttpService,
    ) { }

    async sendVerificationOtp(phone: string, otp: string) {
        try {
            // TODO: Bổ sung API của nhà cung cấp SMS tại đây.
            // Ví dụ:
            //
            // await firstValueFrom(
            //   this.httpService.post(
            //     process.env.SMS_API_URL!,
            //     {
            //       phone,
            //       message: `Ma xac thuc cua ban la ${otp}`,
            //     },
            //     {
            //       headers: {
            //         Authorization: `Bearer ${process.env.SMS_API_TOKEN}`,
            //       },
            //     },
            //   ),
            // );

            this.logger.log(`SMS provider chưa được cấu hình`);

            return {
                success: true,
                message: 'SMS service đã sẵn sàng tích hợp',
            };
        } catch (error) {
            this.logger.error('Không thể gửi SMS OTP');

            throw new InternalServerErrorException(
                'Không thể gửi mã OTP qua SMS',
            );
        }
    }
}
