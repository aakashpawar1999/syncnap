import { Module } from '@nestjs/common';
import { SyncMappingController } from './sync-mapping.controller';
import { SyncMappingService } from './sync-mapping.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [SyncMappingController],
  providers: [SyncMappingService, PrismaService, UserService],
})
export class SyncMappingModule {}
