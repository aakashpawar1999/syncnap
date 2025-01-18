import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SyncMappingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async addMapping(
    supabaseTable: string,
    airtableTable: string,
    supabaseConnectionId: string,
    airtableConnectionId: string,
  ) {
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

      const mapping = await this.prisma.syncMapping.create({
        data: {
          userId: userDataFromDb.id,
          supabaseTable,
          airtableTable,
          supabaseConnectionId,
          airtableConnectionId,
        },
        select: {
          id: true,
        },
      });

      return { data: mapping };
    } catch (error) {
      return 'ERROR';
    }
  }

  async getMappings() {
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

      const mappings = await this.prisma.syncMapping.findMany({
        where: { userId: userDataFromDb.id },
        select: {
          id: true,
          supabaseTable: true,
          airtableTable: true,
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
      });

      return { data: mappings };
    } catch (error) {
      return 'ERROR';
    }
  }
}
