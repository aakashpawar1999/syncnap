import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
  Version,
} from '@nestjs/common';
import { SyncLogService } from './sync-log.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { STATUS_CODES } from '../../common/status-codes';
import { loadMessages } from '../../utils/load-messages.util';
import { CreateSyncLogDto, UpdateSyncLogDto } from './dto';

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
    status: STATUS_CODES.UNAUTHORIZED.code,
    description: MESSAGES.SYNC_LOG.CREATE_SYNC_LOG_ERROR_USER_NOT_FOUND,
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
    const log: any = await this.syncLogService.createLog(
      body.mappingId,
      body.status,
      body.details,
    );

    if (log.data) {
      return {
        ...STATUS_CODES.OK,
        data: log.data || null,
        message: MESSAGES.SYNC_LOG.CREATE_SYNC_LOG_SUCCESS,
      };
    } else if (log === 'ERROR_USER_NOT_FOUND') {
      return {
        ...STATUS_CODES.UNAUTHORIZED,
        message: MESSAGES.SYNC_LOG.CREATE_SYNC_LOG_ERROR_USER_NOT_FOUND,
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
    status: STATUS_CODES.UNAUTHORIZED.code,
    description: MESSAGES.SYNC_LOG.GET_SYNC_LOGS_ERROR_USER_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC_LOG.GET_SYNC_LOGS_FAILURE,
  })
  async getLogs() {
    const logs: any = await this.syncLogService.getLogs();

    if (logs.data) {
      return {
        ...STATUS_CODES.OK,
        data: logs.data || null,
        message: MESSAGES.SYNC_LOG.GET_SYNC_LOGS_SUCCESS,
      };
    } else if (logs === 'ERROR_USER_NOT_FOUND') {
      return {
        ...STATUS_CODES.UNAUTHORIZED,
        message: MESSAGES.SYNC_LOG.GET_SYNC_LOGS_ERROR_USER_NOT_FOUND,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC_LOG.GET_SYNC_LOGS_FAILURE,
      };
    }
  }

  @Put()
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Update sync log' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.SYNC_LOG.UPDATE_SYNC_LOG_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.UNAUTHORIZED.code,
    description: MESSAGES.SYNC_LOG.UPDATE_SYNC_LOG_ERROR_USER_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND.code,
    description:
      MESSAGES.SYNC_LOG.UPDATE_SYNC_LOG_ERROR_USER_SYNC_LOG_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.SYNC_LOG.UPDATE_SYNC_LOG_FAILURE,
  })
  @ApiBody({
    type: UpdateSyncLogDto,
    description: 'Update sync log',
    required: true,
  })
  async updateLog(@Body() body: UpdateSyncLogDto) {
    const log: any = await this.syncLogService.updateLog(
      body.id,
      body.status,
      body.details,
    );

    if (log === 'SUCCESS') {
      return {
        ...STATUS_CODES.OK,
        message: MESSAGES.SYNC_LOG.UPDATE_SYNC_LOG_SUCCESS,
      };
    } else if (log === 'ERROR_USER_NOT_FOUND') {
      return {
        ...STATUS_CODES.UNAUTHORIZED,
        message: MESSAGES.SYNC_LOG.UPDATE_SYNC_LOG_ERROR_USER_NOT_FOUND,
      };
    } else if (log === 'ERROR_USER_SYNC_LOG_NOT_FOUND') {
      return {
        ...STATUS_CODES.NOT_FOUND,
        message:
          MESSAGES.SYNC_LOG.UPDATE_SYNC_LOG_ERROR_USER_SYNC_LOG_NOT_FOUND,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC_LOG.UPDATE_SYNC_LOG_FAILURE,
      };
    }
  }
}
