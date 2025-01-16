import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private readonly prisma: PrismaService,
  ) {}

  async getCurrentUser() {
    const {
      data: { user },
      error,
    }: any = await this.supabase.auth.getUser();
    if (error) {
      return 'ERROR';
    }
    return user;
  }

  async deleteCurrentUser() {
    const { data, error }: any = await this.prisma.user.update({
      where: { id: (await this.getCurrentUser()).id },
      data: { deletedAt: new Date() },
    });
    if (error) {
      return 'ERROR';
    }
    return 'SUCCESS';
  }
}
