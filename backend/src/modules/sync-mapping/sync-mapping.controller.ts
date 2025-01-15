import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Version,
  HttpCode,
} from '@nestjs/common';
import { SyncMappingService } from './sync-mapping.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { STATUS_CODES } from 'src/common/status-codes';
import { loadMessages } from 'src/utils/load-messages.util';
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
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC_MAPPING.ADD_SYNC_MAPPING_ERROR,
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
      body.supabaseConnectionId,
      body.airtableConnectionId,
    );

    if (addMapping) {
      return {
        ...STATUS_CODES.OK,
        data: addMapping || null,
        message: MESSAGES.SYNC_MAPPING.ADD_SYNC_MAPPING_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC_MAPPING.ADD_SYNC_MAPPING_ERROR,
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
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC_MAPPING.GET_SYNC_MAPPINGS_ERROR,
  })
  async getMappings() {
    const getMappings: any = await this.syncMappingService.getMappings();

    if (getMappings) {
      return {
        ...STATUS_CODES.OK,
        data: getMappings || null,
        message: MESSAGES.SYNC_MAPPING.GET_SYNC_MAPPINGS_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC_MAPPING.GET_SYNC_MAPPINGS_ERROR,
      };
    }
  }
}
