import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private readonly transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: process.env.MAIL_SECURE === 'true',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    async sendVerificationOtp(email: string, otp: string) {
        try {
            await this.transporter.sendMail({
                from: process.env.MAIL_FROM,
                to: email,
                subject: 'Xác thực địa chỉ email',
                html: `
          <div>
            <h2>Xác thực email</h2>
            <p>Mã OTP của bạn là:</p>
            <h1>${otp}</h1>
            <p>Mã có hiệu lực trong 5 phút.</p>
          </div>
        `,
            });

            return { success: true };
        } catch {
            throw new InternalServerErrorException('Không thể gửi email OTP');
        }
    }
}