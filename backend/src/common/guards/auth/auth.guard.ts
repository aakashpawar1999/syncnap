import { Injectable, CanActivate, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async canActivate(): Promise<boolean> {
    const { data, error }: any = await this.supabase.auth.getSession();
    if (error || !data.session) {
      return false;
    }
    return true;
  }
}
