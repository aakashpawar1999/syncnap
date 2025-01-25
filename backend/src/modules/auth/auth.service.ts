import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private readonly prisma: PrismaService,
  ) {}

  async getGoogleAuthUrl() {
    const redirectTo = process.env.FRONTEND_APP_URL + '/auth/callback';
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      return 'ERROR';
    }

    return { data };
  }

  async handleGoogleCallback(code: string) {
    try {
      const { data: userData, error: userDataError }: any =
        await this.supabase.auth.exchangeCodeForSession(code);
      if (
        userDataError &&
        (userDataError.status === 400 || userDataError.__isAuthError)
      ) {
        return 'ERROR';
      }

      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: userData.user.email,
          deletedAt: null,
        },
        select: {
          email: true,
          name: true,
        },
      });
      if (existingUser) {
        return existingUser;
      } else {
        const existingUserDeleted = await this.prisma.user.findUnique({
          where: {
            email: userData.user.email,
            deletedAt: { not: null },
          },
          select: {
            email: true,
            name: true,
          },
        });
        if (existingUserDeleted) {
          return 'ERROR';
        }
      }

      const createdUser = await this.prisma.user.create({
        data: {
          email: userData.user.email,
          name:
            userData.user.user_metadata.full_name ||
            userData.user.user_metadata.name,
        },
        select: {
          email: true,
          name: true,
        },
      });

      if (createdUser) {
        return createdUser;
      } else {
        return 'ERROR';
      }
    } catch (error) {
      return 'ERROR';
    }
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      return 'ERROR';
    } else {
      return 'SUCCESS';
    }
  }
}
