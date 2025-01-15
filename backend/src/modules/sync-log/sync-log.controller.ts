import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { SyncLogService } from './sync-log.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { STATUS_CODES } from 'src/common/status-codes';
import { loadMessages } from 'src/utils/load-messages.util';
import { CreateSyncLogDto } from './dto';

const MESSAGES = loadMessages();

@ApiTags('sync-log')
@Controller('sync-log')
@UseGuards(AuthGuard)
export class SyncLogController {
  constructor(private syncLogService: SyncLogService) {}

  @Post()
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Create sync log' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.SYNC_LOG.CREATE_SYNC_LOG_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC_LOG.CREATE_SYNC_LOG_FAILURE,
  })
  @ApiBody({
    type: CreateSyncLogDto,
    description: 'Create sync log',
    required: true,
  })
  async createLog(@Body() body: CreateSyncLogDto) {
    const log = await this.syncLogService.createLog(body.status, body.details);

    if (log) {
      return {
        ...STATUS_CODES.OK,
        data: log || null,
        message: MESSAGES.SYNC_LOG.CREATE_SYNC_LOG_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC_LOG.CREATE_SYNC_LOG_FAILURE,
      };
    }
  }

  @Get()
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Get sync logs' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.SYNC_LOG.GET_SYNC_LOGS_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC_LOG.GET_SYNC_LOGS_FAILURE,
  })
  async getLogs() {
    const logs = await this.syncLogService.getLogs();

    if (logs) {
      return {
        ...STATUS_CODES.OK,
        data: logs || null,
        message: MESSAGES.SYNC_LOG.GET_SYNC_LOGS_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC_LOG.GET_SYNC_LOGS_FAILURE,
      };
    }
  }
}
