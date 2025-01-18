import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { SyncLogService } from '../sync-log/sync-log.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [SyncController],
  providers: [SyncService, PrismaService, SyncLogService, UserService],
})
export class SyncModule {}
