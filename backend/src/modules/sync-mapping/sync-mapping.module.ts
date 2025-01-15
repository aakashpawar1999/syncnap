import { Module } from '@nestjs/common';
import { SyncMappingController } from './sync-mapping.controller';
import { SyncMappingService } from './sync-mapping.service';

@Module({
  controllers: [SyncMappingController],
  providers: [SyncMappingService]
})
export class SyncMappingModule {}
