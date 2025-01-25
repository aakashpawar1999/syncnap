import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private readonly prisma: PrismaService,
  ) {}

  async getCurrentUser(): Promise<any> {
    const {
      data: { user },
      error,
    }: any = await this.supabase.auth.getUser();
    if (error) {
      return 'ERROR';
    }

    const userDeleted = await this.prisma.user.findUnique({
      where: { email: user?.user_metadata.email, deletedAt: { not: null } },
    });
    if (userDeleted) {
      return 'ERROR_USER_DELETED';
    }

    return {
      avatar_url: user?.user_metadata.avatar_url,
      full_name: user?.user_metadata.full_name,
      email: user?.user_metadata.email,
    };
  }

  async deleteCurrentUser() {
    const userData: any = await this.getCurrentUser();
    if (!userData) {
      return 'ERROR_USER_NOT_FOUND';
    }

    const userDataFromDb = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (!userDataFromDb) {
      return 'ERROR_USER_NOT_FOUND';
    }

    const userAlreadyDeleted = await this.prisma.user.findUnique({
      where: { email: userData.email, deletedAt: { not: null } },
    });
    if (userAlreadyDeleted) {
      return 'ERROR_USER_ALREADY_DELETED';
    }

    const { data, error }: any = await this.prisma.user.update({
      where: {
        email: userDataFromDb.email,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
    if (error) {
      return 'ERROR';
    }
    return 'SUCCESS';
  }

  async getPublicKey() {
    const data = process.env.PUBLIC_KEY;
    if (!data) {
      return 'ERROR';
    }
    return { data };
  }
}
