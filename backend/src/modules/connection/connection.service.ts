import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async addSupabaseConnection(projectUrl: string, anonApiKey: string) {
    try {
      const userData: any = await this.userService.getCurrentUser();

      if (!userData) {
        return 'ERROR';
      }

      const supabaseConnection = await this.prisma.supabaseConnection.create({
        data: { userId: userData.user.id, projectUrl, anonApiKey },
      });

      if (supabaseConnection) {
        return { data: supabaseConnection };
      } else {
        return 'ERROR';
      }
    } catch (error) {
      return 'ERROR';
    }
  }

  async getSupabaseConnections() {
    try {
      const userData: any = await this.userService.getCurrentUser();
      if (!userData) {
        return 'ERROR';
      }

      const supabaseConnections = await this.prisma.supabaseConnection.findMany(
        {
          where: { userId: userData.id },
        },
      );
      return { data: supabaseConnections };
    } catch (error) {
      return 'ERROR';
    }
  }

  async addAirtableConnection(accessToken: string, baseId: string) {
    try {
      const userData: any = await this.userService.getCurrentUser();
      if (!userData) {
        return 'ERROR';
      }

      const airtableConnection = await this.prisma.airtableConnection.create({
        data: { userId: userData.id, accessToken, baseId },
      });

      if (airtableConnection) {
        return { data: airtableConnection };
      } else {
        return 'ERROR';
      }
    } catch (error) {
      return 'ERROR';
    }
  }

  async getAirtableConnections() {
    try {
      const userData: any = await this.userService.getCurrentUser();
      if (!userData) {
        return 'ERROR';
      }

      const airtableConnections = await this.prisma.airtableConnection.findMany(
        {
          where: { userId: userData.id },
        },
      );
      return { data: airtableConnections };
    } catch (error) {
      return 'ERROR';
    }
  }
}
