import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConnectionModule } from './modules/connection/connection.module';
import { SyncMappingModule } from './modules/sync-mapping/sync-mapping.module';
import { SyncLogModule } from './modules/sync-log/sync-log.module';
import { SyncModule } from './modules/sync/sync.module';
import { KeyService } from './common/services/key/key.service';
import { CryptoService } from './common/services/crypto/crypto.service';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    SupabaseModule,
    AuthModule,
    ConnectionModule,
    SyncMappingModule,
    SyncLogModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [AppService, KeyService, CryptoService],
})
export class AppModule {}
