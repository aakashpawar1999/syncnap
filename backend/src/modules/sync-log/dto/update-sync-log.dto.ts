import { ApiProperty } from '@nestjs/swagger';
import { SyncStatus } from '@prisma/client';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateSyncLogDto {
  @ApiProperty({ description: 'Sync log id' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Sync log status' })
  @IsString()
  @IsNotEmpty()
  status: SyncStatus;

  @ApiProperty({ description: 'Sync log details' })
  @IsString()
  details?: string;
}
