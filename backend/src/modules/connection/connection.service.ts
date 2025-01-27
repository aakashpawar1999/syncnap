import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { createClient } from '@supabase/supabase-js';
import { CryptoService } from '../../common/services/crypto/crypto.service';
import axios from 'axios';

@Injectable()
export class ConnectionService {
  private readonly AirtableTablesUrl = (baseId: string) =>
    `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
  ) {}

  async addSupabaseConnection(
    connectionName: string,
    projectUrl: string,
    anonApiKey: string,
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

      const supabaseConnection = await this.prisma.supabaseConnection.create({
        data: {
          userId: userDataFromDb.id,
          connectionName,
          projectUrl,
          anonApiKey,
        },
        select: {
          id: true,
        },
      });

      if (supabaseConnection) {
        return { data: supabaseConnection };
      } else {
        return 'ERROR_SUPABASE_CONNECTION_NOT_FOUND';
      }
    } catch (error) {
      return 'ERROR';
    }
  }

  async getSupabaseConnections() {
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

      const supabaseConnections = await this.prisma.supabaseConnection.findMany(
        {
          where: { userId: userDataFromDb.id },
          select: {
            id: true,
            connectionName: true,
          },
        },
      );
      return { data: supabaseConnections };
    } catch (error) {
      return 'ERROR';
    }
  }

  async getSupabaseTables(supabaseConnectionId: string) {
    try {
      const supabaseConnection =
        await this.prisma.supabaseConnection.findUnique({
          where: { id: supabaseConnectionId },
          select: {
            projectUrl: true,
            anonApiKey: true,
          },
        });

      if (!supabaseConnection) {
        return 'ERROR_SUPABASE_CONNECTION_NOT_FOUND';
      }

      const supabase = createClient(
        this.cryptoService.decrypt(supabaseConnection.projectUrl),
        this.cryptoService.decrypt(supabaseConnection.anonApiKey),
      );

      const { data: tables, error } = await supabase.rpc('execute_sql', {
        sql: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
        `,
      });

      if (error) {
        return 'ERROR_SUPABASE_TABLE_NOT_FOUND';
      }

      return { data: tables };
    } catch (error) {
      return 'ERROR';
    }
  }

  async addAirtableConnection(
    connectionName: string,
    accessToken: string,
    baseId: string,
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

      const airtableConnection = await this.prisma.airtableConnection.create({
        data: {
          userId: userDataFromDb.id,
          connectionName,
          accessToken,
          baseId,
        },
        select: {
          id: true,
        },
      });

      if (airtableConnection) {
        return { data: airtableConnection };
      } else {
        return 'ERROR_AIRTABLE_CONNECTION_NOT_FOUND';
      }
    } catch (error) {
      return 'ERROR';
    }
  }

  async getAirtableConnections() {
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

      const airtableConnections = await this.prisma.airtableConnection.findMany(
        {
          where: { userId: userDataFromDb.id },
          select: {
            id: true,
            connectionName: true,
          },
        },
      );
      return { data: airtableConnections };
    } catch (error) {
      return 'ERROR';
    }
  }

  async getAirtableTables(airtableConnectionId: string) {
    try {
      const airtableConnection =
        await this.prisma.airtableConnection.findUnique({
          where: { id: airtableConnectionId },
          select: {
            accessToken: true,
            baseId: true,
          },
        });
      if (!airtableConnection) {
        return 'ERROR_AIRTABLE_CONNECTION_NOT_FOUND';
      }

      const headers = {
        Authorization: `Bearer ${this.cryptoService.decrypt(airtableConnection.accessToken)}`,
        'Content-Type': 'application/json',
      };
      const baseId = this.cryptoService.decrypt(airtableConnection.baseId);
      const tables = await axios.get(this.AirtableTablesUrl(baseId), {
        headers,
      });
      const tablesData = tables.data.tables.map((table: any) => {
        return { id: table.id, name: table.name };
      });
      return {
        data: tablesData,
      };
    } catch (error) {
      return 'ERROR';
    }
  }
}
