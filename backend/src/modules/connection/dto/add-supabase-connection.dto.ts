import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddSupabaseConnectionDto {
  @ApiProperty({ description: 'Supabase project url' })
  @IsString()
  @IsNotEmpty()
  projectUrl: string;

  @ApiProperty({ description: 'Supabase anon api key' })
  @IsString()
  @IsNotEmpty()
  anonApiKey: string;
}
