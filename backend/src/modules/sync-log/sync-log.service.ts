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
        return 'ERROR';
      }

      const userDataFromDb = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (!userDataFromDb) {
        return 'ERROR';
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
        select: {
          status: true,
          details: true,
          createdAt: true,
          SyncMapping: {
            select: {
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
}
