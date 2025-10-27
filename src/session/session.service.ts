import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
    constructor(private prisma: PrismaService) { }

    async createSession(userId: string, refreshToken: string) {
        const session = await this.prisma.session.create({
            data: {
                userId,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
        });
        return session;
    }
    async deleteSession(refreshToken: string) {
        const result = await this.prisma.session.deleteMany({
            where: { refreshToken },
        });
        return result;
    }
    async getSessionByRefreshToken(refreshToken: string) {
        const session = await this.prisma.session.findUnique({
            where: { refreshToken },
        });
        return session;
    }
}
