import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddAirtableConnectionDto {
  @ApiProperty({ description: 'Airtable access token' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({ description: 'Airtable base id' })
  @IsString()
  @IsNotEmpty()
  baseId: string;
}
