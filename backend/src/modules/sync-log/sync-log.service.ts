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

  async createLog(mappingId: string, status: SyncStatus, details?: string) {
    try {
      const userData: any = await this.userService.getCurrentUser();
      if (!userData) {
        return 'ERROR_USER_NOT_FOUND';
      }

      const userDataFromDb = await this.prisma.user.findUnique({
        where: { email: userData.email, deletedAt: null },
      });
      if (!userDataFromDb) {
        return 'ERROR_USER_NOT_FOUND';
      }

      const log = await this.prisma.syncLog.create({
        data: {
          userId: userDataFromDb.id,
          syncMappingId: mappingId,
          status,
          details,
        },
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
        return 'ERROR_USER_NOT_FOUND';
      }

      const userDataFromDb = await this.prisma.user.findUnique({
        where: { email: userData.email, deletedAt: null },
      });
      if (!userDataFromDb) {
        return 'ERROR_USER_NOT_FOUND';
      }

      const logs = await this.prisma.syncLog.findMany({
        where: { userId: userDataFromDb.id },
        orderBy: { createdAt: 'desc' },
        select: {
          status: true,
          details: true,
          createdAt: true,
          SyncMapping: {
            select: {
              supabaseTable: true,
              airtableTable: true,
              airtableDisplayName: true,
              supabaseConnections: {
                select: {
                  connectionName: true,
                },
              },
              airtableConnections: {
                select: {
                  connectionName: true,
                },
              },
            },
          },
        },
      });

      return { data: logs };
    } catch (error) {
      return 'ERROR';
    }
  }

  async updateLog(logId: string, status: SyncStatus, details?: string) {
    try {
      const userData: any = await this.userService.getCurrentUser();
      if (!userData) {
        return 'ERROR_USER_NOT_FOUND';
      }

      const userDataFromDb = await this.prisma.user.findUnique({
        where: { email: userData.email, deletedAt: null },
      });
      if (!userDataFromDb) {
        return 'ERROR_USER_NOT_FOUND';
      }

      const log = await this.prisma.syncLog.findUnique({
        where: { id: logId, userId: userDataFromDb.id },
      });
      if (!log) {
        return 'ERROR_USER_SYNC_LOG_NOT_FOUND';
      }

      await this.prisma.syncLog.update({
        where: { id: logId, userId: userDataFromDb.id },
        data: { status, details },
      });

      return 'SUCCESS';
    } catch (error) {
      return 'ERROR';
    }
  }
}
