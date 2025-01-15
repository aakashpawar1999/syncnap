import { Global, Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useValue: createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY,
        {
          auth: {
            flowType: 'pkce',
            persistSession: true,
          },
        },
      ),
    },
  ],
  exports: ['SUPABASE_CLIENT'], // Export Supabase client for use in other modules
})
export class SupabaseModule {}
