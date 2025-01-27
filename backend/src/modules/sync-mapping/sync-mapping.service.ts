import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { createClient } from '@supabase/supabase-js';
import { CryptoService } from '../../common/services/crypto/crypto.service';

@Injectable()
export class SyncMappingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
  ) {}

  async addMapping(
    supabaseTable: string,
    airtableTable: string,
    airtableDisplayName: string,
    supabaseConnectionId: string,
    airtableConnectionId: string,
  ) {
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

      const supabaseConnections =
        await this.prisma.supabaseConnection.findUnique({
          where: { id: supabaseConnectionId },
        });
      if (!supabaseConnections) {
        return 'ERROR_SUPABASE_CONNECTION_NOT_FOUND';
      }
      const supabase = createClient(
        this.cryptoService.decrypt(supabaseConnections.projectUrl),
        this.cryptoService.decrypt(supabaseConnections.anonApiKey),
      );
      const { data: supabaseData, error: supabaseError } = await supabase
        .from(supabaseTable)
        .select('*')
        .limit(1);
      if (supabaseError) {
        return 'ERROR_SUPABASE_TABLE_NOT_FOUND';
      }
      if (!supabaseData || supabaseData.length === 0) {
        return 'ERROR_SUPABASE_TABLE_NOT_FOUND';
      }

      const mapping = await this.prisma.syncMapping.create({
        data: {
          userId: userDataFromDb.id,
          supabaseTable,
          airtableTable,
          airtableDisplayName,
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
        return 'ERROR_USER_NOT_FOUND';
      }

      const userDataFromDb = await this.prisma.user.findUnique({
        where: { email: userData.email, deletedAt: null },
      });
      if (!userDataFromDb) {
        return 'ERROR_USER_NOT_FOUND';
      }

      const mappings = await this.prisma.syncMapping.findMany({
        where: { userId: userDataFromDb.id, deletedAt: null },
        select: {
          id: true,
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
          syncLogs: {
            select: {
              status: true,
              details: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      return { data: mappings };
    } catch (error) {
      return 'ERROR';
    }
  }

  async deleteMapping(id: string) {
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

      await this.prisma.syncMapping.update({
        where: { id, userId: userDataFromDb.id },
        data: { deletedAt: new Date() },
      });
      return 'SUCCESS';
    } catch (error) {
      return 'ERROR';
    }
  }
}
