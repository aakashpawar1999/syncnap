import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddSyncMappingDto {
  @ApiProperty({ description: 'Supabase table name' })
  @IsNotEmpty()
  @IsString()
  supabaseTable: string;

  @ApiProperty({ description: 'Airtable table name' })
  @IsNotEmpty()
  @IsString()
  airtableTable: string;

  @ApiProperty({ description: 'Airtable display name' })
  @IsNotEmpty()
  @IsString()
  airtableDisplayName: string;

  @ApiProperty({ description: 'Supabase connection id' })
  @IsNotEmpty()
  @IsString()
  supabaseConnectionId: string;

  @ApiProperty({ description: 'Airtable connection id' })
  @IsNotEmpty()
  @IsString()
  airtableConnectionId: string;
}
