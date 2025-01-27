import { Module } from '@nestjs/common';
import { SyncLogController } from './sync-log.controller';
import { SyncLogService } from './sync-log.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [SyncLogController],
  providers: [SyncLogService, PrismaService, UserService],
})
export class SyncLogModule {}
