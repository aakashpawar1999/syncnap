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
import { STATUS_CODES } from 'src/common/status-codes';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { loadMessages } from 'src/utils/load-messages.util';
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

    if (syncTable) {
      return {
        ...STATUS_CODES.OK,
        data: syncTable || null,
        message: MESSAGES.SYNC.SYNC_TABLE_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.SYNC.SYNC_TABLE_FAILURE,
      };
    }
  }
}
