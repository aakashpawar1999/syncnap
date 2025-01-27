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
import { loadMessages } from '../../utils/load-messages.util';
import { STATUS_CODES } from '../../common/status-codes';
import { AuthGuard } from '../../common/guards/auth/auth.guard';

const MESSAGES = loadMessages();

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('details')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Get current user details' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.USER.GET_CURRENT_USER_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.UNAUTHORIZED.code,
    description: MESSAGES.USER.GET_CURRENT_USER_ERROR_USER_DELETED,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.USER.GET_CURRENT_USER_FAILURE,
  })
  async getCurrentUser() {
    const getUser: any = await this.userService.getCurrentUser();

    if (getUser.email) {
      return {
        ...STATUS_CODES.OK,
        data: getUser || null,
        message: MESSAGES.USER.GET_CURRENT_USER_SUCCESS,
      };
    } else if (getUser === 'ERROR_USER_DELETED') {
      return {
        ...STATUS_CODES.UNAUTHORIZED,
        message: MESSAGES.USER.GET_CURRENT_USER_ERROR_USER_DELETED,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.USER.GET_CURRENT_USER_FAILURE,
      };
    }
  }

  @Delete('delete')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.USER.DELETE_CURRENT_USER_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.UNAUTHORIZED.code,
    description: MESSAGES.USER.DELETE_CURRENT_USER_ERROR_USER_NOT_FOUND,
  })
  @ApiResponse({
    status: STATUS_CODES.UNAUTHORIZED.code,
    description: MESSAGES.USER.DELETE_CURRENT_USER_ERROR_USER_ALREADY_DELETED,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.USER.DELETE_CURRENT_USER_FAILURE,
  })
  async deleteCurrentUser() {
    const deleteStatus: any = await this.userService.deleteCurrentUser();

    if (deleteStatus === 'SUCCESS') {
      return {
        ...STATUS_CODES.OK,
        message: MESSAGES.USER.DELETE_CURRENT_USER_SUCCESS,
      };
    } else if (deleteStatus === 'ERROR_USER_NOT_FOUND') {
      return {
        ...STATUS_CODES.UNAUTHORIZED,
        message: MESSAGES.USER.DELETE_CURRENT_USER_ERROR_USER_NOT_FOUND,
      };
    } else if (deleteStatus === 'ERROR_USER_ALREADY_DELETED') {
      return {
        ...STATUS_CODES.UNAUTHORIZED,
        message: MESSAGES.USER.DELETE_CURRENT_USER_ERROR_USER_ALREADY_DELETED,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.USER.DELETE_CURRENT_USER_FAILURE,
      };
    }
  }

  @Get('public-key')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'Get public key' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.USER.GET_PUBLIC_KEY_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.USER.GET_PUBLIC_KEY_FAILURE,
  })
  async getPublicKey() {
    const publicKey: any = await this.userService.getPublicKey();

    if (publicKey.data) {
      return {
        ...STATUS_CODES.OK,
        data: publicKey.data,
        message: MESSAGES.USER.GET_PUBLIC_KEY_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.USER.GET_PUBLIC_KEY_FAILURE,
      };
    }
  }
}
