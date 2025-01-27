import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Version,
  HttpCode,
  Delete,
  Param,
} from '@nestjs/common';
import { SyncMappingService } from './sync-mapping.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { STATUS_CODES } from '../../common/status-codes';
import { loadMessages } from '../../utils/load-messages.util';
import { AddSyncMappingDto } from './dto';

const MESSAGES = loadMessages();

@ApiTags('sync-mapping')
@Controller('sync-mapping')
@UseGuards(AuthGuard)
export class SyncMappingController {
  constructor(private readonly syncMappingService: SyncMappingService) {}

  @Post()
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Add sync mapping' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.SYNC_MAPPING.ADD_SYNC_MAPPING_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.UNAUTHORIZED.code,
    description: MESSAGES.SYNC_MAPPING.ADD_SYNC_MAPPING_ERROR_USER_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.SYNC_MAPPING
        .ADD_SYNC_MAPPING_ERROR_SUPABASE_CONNECTION_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.SYNC_MAPPING.ADD_SYNC_MAPPING_ERROR_SUPABASE_TABLE_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC_MAPPING.ADD_SYNC_MAPPING_FAILURE,
  })
  @ApiBody({
    description: 'Add sync mapping',
    required: true,
    type: AddSyncMappingDto,
  })
  async addMapping(@Body() body: AddSyncMappingDto) {
    const addMapping: any = await this.syncMappingService.addMapping(
      body.supabaseTable,
      body.airtableTable,
      body.airtableDisplayName,
      body.supabaseConnectionId,
      body.airtableConnectionId,
    );

    if (addMapping.data) {
      return {
        ...STATUS_CODES.OK,
        data: addMapping.data || null,
        message: MESSAGES.SYNC_MAPPING.ADD_SYNC_MAPPING_SUCCESS,
      };
    } else if (addMapping === 'ERROR_USER_NOT_FOUND') {
      return {
        ...STATUS_CODES.UNAUTHORIZED,
        message: MESSAGES.SYNC_MAPPING.ADD_SYNC_MAPPING_ERROR_USER_NOT_FOUND,
      };
    } else if (addMapping === 'ERROR_SUPABASE_CONNECTION_NOT_FOUND') {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.SYNC_MAPPING
            .ADD_SYNC_MAPPING_ERROR_SUPABASE_CONNECTION_NOT_FOUND,
      };
    } else if (addMapping === 'ERROR_SUPABASE_TABLE_NOT_FOUND') {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.SYNC_MAPPING.ADD_SYNC_MAPPING_ERROR_SUPABASE_TABLE_NOT_FOUND,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC_MAPPING.ADD_SYNC_MAPPING_FAILURE,
      };
    }
  }

  @Get()
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Get sync mappings' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.SYNC_MAPPING.GET_SYNC_MAPPINGS_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.UNAUTHORIZED.code,
    description: MESSAGES.SYNC_MAPPING.GET_SYNC_MAPPINGS_ERROR_USER_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC_MAPPING.GET_SYNC_MAPPINGS_FAILURE,
  })
  async getMappings() {
    const getMappings: any = await this.syncMappingService.getMappings();

    if (getMappings.data) {
      return {
        ...STATUS_CODES.OK,
        data: getMappings.data || null,
        message: MESSAGES.SYNC_MAPPING.GET_SYNC_MAPPINGS_SUCCESS,
      };
    } else if (getMappings === 'ERROR_USER_NOT_FOUND') {
      return {
        ...STATUS_CODES.UNAUTHORIZED,
        message: MESSAGES.SYNC_MAPPING.GET_SYNC_MAPPINGS_ERROR_USER_NOT_FOUND,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC_MAPPING.GET_SYNC_MAPPINGS_FAILURE,
      };
    }
  }

  @Delete(':id')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Delete sync mapping' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.SYNC_MAPPING.DELETE_SYNC_MAPPING_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.UNAUTHORIZED.code,
    description: MESSAGES.SYNC_MAPPING.DELETE_SYNC_MAPPING_ERROR_USER_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC_MAPPING.DELETE_SYNC_MAPPING_FAILURE,
  })
  @ApiParam({
    name: 'id',
    description: 'Sync mapping id',
    required: true,
  })
  async deleteMapping(@Param('id') id: string) {
    const deleteMapping: any = await this.syncMappingService.deleteMapping(id);

    if (deleteMapping === 'SUCCESS') {
      return {
        ...STATUS_CODES.OK,
        message: MESSAGES.SYNC_MAPPING.DELETE_SYNC_MAPPING_SUCCESS,
      };
    } else if (deleteMapping === 'ERROR_USER_NOT_FOUND') {
      return {
        ...STATUS_CODES.UNAUTHORIZED,
        message: MESSAGES.SYNC_MAPPING.DELETE_SYNC_MAPPING_ERROR_USER_NOT_FOUND,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC_MAPPING.DELETE_SYNC_MAPPING_FAILURE,
      };
    }
  }
}
