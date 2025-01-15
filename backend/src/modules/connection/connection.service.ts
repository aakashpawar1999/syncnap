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

      const userDataFromDb = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (!userDataFromDb) {
        return 'ERROR';
      }

      const supabaseConnection = await this.prisma.supabaseConnection.create({
        data: { userId: userDataFromDb.id, projectUrl, anonApiKey },
        select: {
          projectUrl: true,
          anonApiKey: true,
        },
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

      const userDataFromDb = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (!userDataFromDb) {
        return 'ERROR';
      }

      const supabaseConnections = await this.prisma.supabaseConnection.findMany(
        {
          where: { userId: userDataFromDb.id },
          select: {
            projectUrl: true,
            anonApiKey: true,
          },
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

      const userDataFromDb = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (!userDataFromDb) {
        return 'ERROR';
      }

      const airtableConnection = await this.prisma.airtableConnection.create({
        data: { userId: userDataFromDb.id, accessToken, baseId },
        select: {
          accessToken: true,
          baseId: true,
        },
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

      const userDataFromDb = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (!userDataFromDb) {
        return 'ERROR';
      }

      const airtableConnections = await this.prisma.airtableConnection.findMany(
        {
          where: { userId: userDataFromDb.id },
          select: {
            accessToken: true,
            baseId: true,
          },
        },
      );
      return { data: airtableConnections };
    } catch (error) {
      return 'ERROR';
    }
  }
}
