import {
  Controller,
  Delete,
  Get,
  Version,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { loadMessages } from 'src/utils/load-messages.util';
import { STATUS_CODES } from 'src/common/status-codes';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

const MESSAGES = loadMessages();

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Get current user details' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.USER.GET_CURRENT_USER_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.USER.GET_CURRENT_USER_FAILURE,
  })
  async getCurrentUser() {
    const getUser: any = await this.userService.getCurrentUser();

    if (getUser) {
      return {
        ...STATUS_CODES.OK,
        data: getUser || null,
        message: MESSAGES.USER.GET_CURRENT_USER_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.USER.GET_CURRENT_USER_FAILURE,
      };
    }
  }

  @Delete()
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.USER.DELETE_CURRENT_USER_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.USER.DELETE_CURRENT_USER_FAILURE,
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  async deleteCurrentUser() {
    const deleteStatus: any = await this.userService.deleteCurrentUser();

    if (deleteStatus === 'SUCCESS') {
      return {
        ...STATUS_CODES.OK,
        message: MESSAGES.USER.DELETE_CURRENT_USER_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.USER.DELETE_USER_BY_ID_FAILURE,
      };
    }
  }
}
