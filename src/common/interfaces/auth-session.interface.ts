import { Prisma } from "../../generated/prisma/client.js";

export type UsersSafe = Omit<
    Prisma.usersGetPayload<{}>,
    'password_hash'
>;

export interface AuthSession {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
    user: UsersSafe;
}