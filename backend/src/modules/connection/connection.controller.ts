import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Version,
  HttpCode,
} from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { STATUS_CODES } from 'src/common/status-codes';
import { loadMessages } from 'src/utils/load-messages.util';

const MESSAGES = loadMessages();

@ApiTags('connections')
@Controller('connections')
@UseGuards(AuthGuard)
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post('supabase')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Add supabase connection' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.CONNECTION.ADD_SUPABASE_CONNECTION_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.CONNECTION.ADD_SUPABASE_CONNECTION_FAILURE,
  })
  async addSupabaseConnection(@Body() body: any) {
    return this.connectionService.addSupabaseConnection(
      body.projectUrl,
      body.anonApiKey,
    );
  }

  @Get('supabase')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Get supabase connections' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.CONNECTION.GET_SUPABASE_CONNECTIONS_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.CONNECTION.GET_SUPABASE_CONNECTIONS_FAILURE,
  })
  async getSupabaseConnections() {
    return this.connectionService.getSupabaseConnections();
  }

  @Post('airtable')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Add airtable connection' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.CONNECTION.ADD_AIRTABLE_CONNECTION_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.CONNECTION.ADD_AIRTABLE_CONNECTION_FAILURE,
  })
  async addAirtableConnection(@Body() body: any) {
    return this.connectionService.addAirtableConnection(
      body.accessToken,
      body.baseId,
    );
  }

  @Get('airtable')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Get airtable connections' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.CONNECTION.GET_AIRTABLE_CONNECTIONS_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.CONNECTION.GET_AIRTABLE_CONNECTIONS_FAILURE,
  })
  async getAirtableConnections() {
    return this.connectionService.getAirtableConnections();
  }
}
