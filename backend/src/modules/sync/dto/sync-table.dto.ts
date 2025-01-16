import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SyncTableDto {
  @ApiProperty({ description: 'Mapping ID' })
  @IsString()
  @IsNotEmpty()
  mappingId: string;
}
