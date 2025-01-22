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
    return {
      avatar_url: user?.user_metadata.avatar_url,
      full_name: user?.user_metadata.full_name,
      email: user?.user_metadata.email,
    };
  }

  async deleteCurrentUser() {
    const { data, error }: any = await this.prisma.user.update({
      where: { email: (await this.getCurrentUser()).email },
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
