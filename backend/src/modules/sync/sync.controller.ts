import {
  Body,
  Controller,
  HttpCode,
  UseGuards,
  Post,
  Version,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { STATUS_CODES } from '../../common/status-codes';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { loadMessages } from '../../utils/load-messages.util';
import { SyncTableDto } from './dto';

const MESSAGES = loadMessages();

@ApiTags('sync')
@Controller('sync')
@UseGuards(AuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Sync table' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.SYNC.SYNC_TABLE_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND.code,
    description: MESSAGES.SYNC.SYNC_TABLE_ERROR_SYNC_MAPPING_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description:
      MESSAGES.SYNC.SYNC_TABLE_ERROR_SUPABASE_OR_AIRTABLE_CONNECTION_ISSUE,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC.SYNC_TABLE_ERROR_SUPABASE_CONNECTION_ISSUE,
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND.code,
    description: MESSAGES.SYNC.SYNC_TABLE_ERROR_SUPABASE_SCHEMA_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND.code,
    description: MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_SCHEMA_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description:
      MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_SCHEMA_FIELD_REMOVAL_ISSUE,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description:
      MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_SCHEMA_FIELD_ADDITION_ISSUE,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC.SYNC_TABLE_ERROR_SUPABASE_TABLE_DATA_FETCH_ISSUE,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_TABLE_DATA_FETCH_ISSUE,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_DATA_CONVERSION_ISSUE,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_TABLE_DATA_SYNC_ISSUE,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC.SYNC_TABLE_FAILURE,
  })
  @ApiBody({
    type: SyncTableDto,
    description: 'Sync table',
    required: true,
  })
  async syncTable(@Body() body: SyncTableDto) {
    const { mappingId } = body;
    const syncTable: any = await this.syncService.syncTable(mappingId);

    if (syncTable === 'SUCCESS') {
      return {
        ...STATUS_CODES.OK,
        message: MESSAGES.SYNC.SYNC_TABLE_SUCCESS,
      };
    } else if (syncTable === 'ERROR_SYNC_MAPPING_NOT_FOUND') {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message: MESSAGES.SYNC.SYNC_TABLE_ERROR_SYNC_MAPPING_NOT_FOUND,
      };
    } else if (syncTable === 'ERROR_SUPABASE_OR_AIRTABLE_CONNECTION_ISSUE') {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message:
          MESSAGES.SYNC.SYNC_TABLE_ERROR_SUPABASE_OR_AIRTABLE_CONNECTION_ISSUE,
      };
    } else if (syncTable === 'ERROR_SUPABASE_CONNECTION_ISSUE') {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC.SYNC_TABLE_ERROR_SUPABASE_CONNECTION_ISSUE,
      };
    } else if (syncTable === 'ERROR_SUPABASE_SCHEMA_NOT_FOUND') {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message: MESSAGES.SYNC.SYNC_TABLE_ERROR_SUPABASE_SCHEMA_NOT_FOUND,
      };
    } else if (syncTable === 'ERROR_AIRTABLE_SCHEMA_NOT_FOUND') {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message: MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_SCHEMA_NOT_FOUND,
      };
    } else if (syncTable === 'ERROR_AIRTABLE_SCHEMA_FIELD_REMOVAL_ISSUE') {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message:
          MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_SCHEMA_FIELD_REMOVAL_ISSUE,
      };
    } else if (syncTable === 'ERROR_AIRTABLE_SCHEMA_FIELD_ADDITION_ISSUE') {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message:
          MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_SCHEMA_FIELD_ADDITION_ISSUE,
      };
    } else if (syncTable === 'ERROR_SUPABASE_TABLE_DATA_FETCH_ISSUE') {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC.SYNC_TABLE_ERROR_SUPABASE_TABLE_DATA_FETCH_ISSUE,
      };
    } else if (syncTable === 'ERROR_AIRTABLE_TABLE_DATA_FETCH_ISSUE') {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_TABLE_DATA_FETCH_ISSUE,
      };
    } else if (syncTable === 'ERROR_AIRTABLE_DATA_CONVERSION_ISSUE') {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_DATA_CONVERSION_ISSUE,
      };
    } else if (syncTable === 'ERROR_AIRTABLE_TABLE_DATA_SYNC_ISSUE') {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC.SYNC_TABLE_ERROR_AIRTABLE_TABLE_DATA_SYNC_ISSUE,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC.SYNC_TABLE_FAILURE,
      };
    }
  }
}
