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
    const addSupabaseConnection: any =
      await this.connectionService.addSupabaseConnection(
        body.projectUrl,
        body.anonApiKey,
      );

    if (addSupabaseConnection) {
      return {
        ...STATUS_CODES.OK,
        data: addSupabaseConnection || null,
        message: MESSAGES.CONNECTION.ADD_SUPABASE_CONNECTION_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.CONNECTION.ADD_SUPABASE_CONNECTION_FAILURE,
      };
    }
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
    const getSupabaseConnections: any =
      await this.connectionService.getSupabaseConnections();

    if (getSupabaseConnections) {
      return {
        ...STATUS_CODES.OK,
        data: getSupabaseConnections || null,
        message: MESSAGES.CONNECTION.GET_SUPABASE_CONNECTIONS_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.CONNECTION.GET_SUPABASE_CONNECTIONS_FAILURE,
      };
    }
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
    const addAirtableConnection: any =
      await this.connectionService.addAirtableConnection(
        body.accessToken,
        body.baseId,
      );

    if (addAirtableConnection) {
      return {
        ...STATUS_CODES.OK,
        data: addAirtableConnection || null,
        message: MESSAGES.CONNECTION.ADD_AIRTABLE_CONNECTION_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.CONNECTION.ADD_AIRTABLE_CONNECTION_FAILURE,
      };
    }
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
    const getAirtableConnections: any =
      await this.connectionService.getAirtableConnections();

    if (getAirtableConnections) {
      return {
        ...STATUS_CODES.OK,
        data: getAirtableConnections || null,
        message: MESSAGES.CONNECTION.GET_AIRTABLE_CONNECTIONS_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.CONNECTION.GET_AIRTABLE_CONNECTIONS_FAILURE,
      };
    }
  }
}
