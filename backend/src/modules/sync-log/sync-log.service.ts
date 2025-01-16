import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { SyncStatus } from '@prisma/client';

@Injectable()
export class SyncLogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createLog(status: SyncStatus, details?: string) {
    try {
      const userData: any = await this.userService.getCurrentUser();
      if (!userData) {
        return 'ERROR';
      }

      const userDataFromDb = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (!userDataFromDb) {
        return 'ERROR';
      }

      const log = await this.prisma.syncLog.create({
        data: { userId: userDataFromDb.id, status, details },
      });

      return { data: log };
    } catch (error) {
      return 'ERROR';
    }
  }

  async getLogs() {
    try {
      const userData: any = await this.userService.getCurrentUser();
      if (!userData) {
        return 'ERROR';
      }

      const userDataFromDb = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (!userDataFromDb) {
        return 'ERROR';
      }

      const logs = await this.prisma.syncLog.findMany({
        where: { userId: userDataFromDb.id },
        orderBy: { createdAt: 'desc' },
      });

      return { data: logs };
    } catch (error) {
      return 'ERROR';
    }
  }
}
