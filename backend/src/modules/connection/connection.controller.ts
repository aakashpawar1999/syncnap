import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Version,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { STATUS_CODES } from 'src/common/status-codes';
import { loadMessages } from 'src/utils/load-messages.util';
import { AddSupabaseConnectionDto, AddAirtableConnectionDto } from './dto';

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
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.CONNECTION.ADD_SUPABASE_CONNECTION_ERROR_USER_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.CONNECTION
        .ADD_SUPABASE_CONNECTION_ERROR_SUPABASE_CONNECTION_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.CONNECTION.ADD_SUPABASE_CONNECTION_FAILURE,
  })
  @ApiBody({
    type: AddSupabaseConnectionDto,
    description: 'Add supabase connection',
    required: true,
  })
  async addSupabaseConnection(@Body() body: AddSupabaseConnectionDto) {
    const addSupabaseConnection: any =
      await this.connectionService.addSupabaseConnection(
        body.connectionName,
        body.projectUrl,
        body.anonApiKey,
      );

    if (addSupabaseConnection.data) {
      return {
        ...STATUS_CODES.OK,
        data: addSupabaseConnection.data || null,
        message: MESSAGES.CONNECTION.ADD_SUPABASE_CONNECTION_SUCCESS,
      };
    } else if (addSupabaseConnection.message === 'ERROR_USER_NOT_FOUND') {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.CONNECTION.ADD_SUPABASE_CONNECTION_ERROR_USER_NOT_FOUND,
      };
    } else if (
      addSupabaseConnection.message === 'ERROR_SUPABASE_CONNECTION_NOT_FOUND'
    ) {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.CONNECTION
            .ADD_SUPABASE_CONNECTION_ERROR_SUPABASE_CONNECTION_NOT_FOUND,
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
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.CONNECTION.GET_SUPABASE_CONNECTIONS_ERROR_USER_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.CONNECTION.GET_SUPABASE_CONNECTIONS_FAILURE,
  })
  async getSupabaseConnections() {
    const getSupabaseConnections: any =
      await this.connectionService.getSupabaseConnections();

    if (getSupabaseConnections.data) {
      return {
        ...STATUS_CODES.OK,
        data: getSupabaseConnections.data || null,
        message: MESSAGES.CONNECTION.GET_SUPABASE_CONNECTIONS_SUCCESS,
      };
    } else if (getSupabaseConnections.message === 'ERROR_USER_NOT_FOUND') {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.CONNECTION.GET_SUPABASE_CONNECTIONS_ERROR_USER_NOT_FOUND,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.CONNECTION.GET_SUPABASE_CONNECTIONS_FAILURE,
      };
    }
  }

  @Get('supabase/tables')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Get supabase tables' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.CONNECTION.GET_SUPABASE_TABLES_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.CONNECTION
        .GET_SUPABASE_TABLES_ERROR_SUPABASE_CONNECTION_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.CONNECTION.GET_SUPABASE_TABLES_ERROR_SUPABASE_TABLE_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.CONNECTION.GET_SUPABASE_TABLES_FAILURE,
  })
  @ApiQuery({
    name: 'supabaseConnectionId',
    type: String,
    description: 'Supabase connection ID',
    required: true,
  })
  async getSupabaseTables(
    @Query('supabaseConnectionId') supabaseConnectionId: string,
  ) {
    const getSupabaseTables: any =
      await this.connectionService.getSupabaseTables(supabaseConnectionId);

    if (getSupabaseTables.data) {
      return {
        ...STATUS_CODES.OK,
        data: getSupabaseTables.data || null,
        message: MESSAGES.CONNECTION.GET_SUPABASE_TABLES_SUCCESS,
      };
    } else if (
      getSupabaseTables.message === 'ERROR_SUPABASE_CONNECTION_NOT_FOUND'
    ) {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.CONNECTION
            .GET_SUPABASE_TABLES_ERROR_SUPABASE_CONNECTION_NOT_FOUND,
      };
    } else if (getSupabaseTables.message === 'ERROR_SUPABASE_TABLE_NOT_FOUND') {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.CONNECTION
            .GET_SUPABASE_TABLES_ERROR_SUPABASE_TABLE_NOT_FOUND,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.CONNECTION.GET_SUPABASE_TABLES_FAILURE,
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
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.CONNECTION.ADD_AIRTABLE_CONNECTION_ERROR_USER_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.CONNECTION
        .ADD_AIRTABLE_CONNECTION_ERROR_AIRTABLE_CONNECTION_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.CONNECTION.ADD_AIRTABLE_CONNECTION_FAILURE,
  })
  @ApiBody({
    type: AddAirtableConnectionDto,
    description: 'Add airtable connection',
    required: true,
  })
  async addAirtableConnection(@Body() body: AddAirtableConnectionDto) {
    const addAirtableConnection: any =
      await this.connectionService.addAirtableConnection(
        body.connectionName,
        body.accessToken,
        body.baseId,
      );

    if (addAirtableConnection.data) {
      return {
        ...STATUS_CODES.OK,
        data: addAirtableConnection.data || null,
        message: MESSAGES.CONNECTION.ADD_AIRTABLE_CONNECTION_SUCCESS,
      };
    } else if (addAirtableConnection.message === 'ERROR_USER_NOT_FOUND') {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.CONNECTION.ADD_AIRTABLE_CONNECTION_ERROR_USER_NOT_FOUND,
      };
    } else if (
      addAirtableConnection.message === 'ERROR_AIRTABLE_CONNECTION_NOT_FOUND'
    ) {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.CONNECTION
            .ADD_AIRTABLE_CONNECTION_ERROR_AIRTABLE_CONNECTION_NOT_FOUND,
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
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.CONNECTION.GET_AIRTABLE_CONNECTIONS_ERROR_USER_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.CONNECTION.GET_AIRTABLE_CONNECTIONS_FAILURE,
  })
  async getAirtableConnections() {
    const getAirtableConnections: any =
      await this.connectionService.getAirtableConnections();

    if (getAirtableConnections.data) {
      return {
        ...STATUS_CODES.OK,
        data: getAirtableConnections.data || null,
        message: MESSAGES.CONNECTION.GET_AIRTABLE_CONNECTIONS_SUCCESS,
      };
    } else if (getAirtableConnections.message === 'ERROR_USER_NOT_FOUND') {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.CONNECTION.GET_AIRTABLE_CONNECTIONS_ERROR_USER_NOT_FOUND,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.CONNECTION.GET_AIRTABLE_CONNECTIONS_FAILURE,
      };
    }
  }

  @Get('airtable/tables')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Get airtable tables' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.CONNECTION.GET_AIRTABLE_TABLES_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.CONNECTION
        .GET_AIRTABLE_TABLES_ERROR_AIRTABLE_CONNECTION_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.CONNECTION.GET_AIRTABLE_TABLES_FAILURE,
  })
  @ApiQuery({
    name: 'airtableConnectionId',
    type: String,
    description: 'Airtable connection ID',
    required: true,
  })
  async getAirtableTables(
    @Query('airtableConnectionId') airtableConnectionId: string,
  ) {
    const getAirtableTables: any =
      await this.connectionService.getAirtableTables(airtableConnectionId);

    if (getAirtableTables.data) {
      return {
        ...STATUS_CODES.OK,
        data: getAirtableTables.data || null,
        message: MESSAGES.CONNECTION.GET_AIRTABLE_TABLES_SUCCESS,
      };
    } else if (
      getAirtableTables.message === 'ERROR_AIRTABLE_CONNECTION_NOT_FOUND'
    ) {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.CONNECTION
            .GET_AIRTABLE_TABLES_ERROR_AIRTABLE_CONNECTION_NOT_FOUND,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.CONNECTION.GET_AIRTABLE_TABLES_FAILURE,
      };
    }
  }
}
