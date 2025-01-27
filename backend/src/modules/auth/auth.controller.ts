import {
  Controller,
  Get,
  HttpCode,
  Query,
  Req,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loadMessages } from '../../utils/load-messages.util';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { STATUS_CODES } from '../../common/status-codes';
import { AuthGuard } from '../../common/guards/auth/auth.guard';

const MESSAGES = loadMessages();

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'User login with Google' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.AUTH.LOGIN_REQUEST_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.AUTH.LOGIN_REQUEST_FAILURE,
  })
  async googleLogin() {
    const loginData: any = await this.authService.getGoogleAuthUrl();

    if (loginData.data) {
      return {
        ...STATUS_CODES.OK,
        data: loginData.data,
        message: MESSAGES.AUTH.LOGIN_REQUEST_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.AUTH.LOGIN_REQUEST_FAILURE,
      };
    }
  }

  @Get('callback')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'User session create and redirect' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.AUTH.LOGIN_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.AUTH.LOGIN_FAILURE,
  })
  async googleCallback(@Query('code') code: string) {
    const userData: any = await this.authService.handleGoogleCallback(
      code as string,
    );

    if (userData !== 'ERROR') {
      return {
        ...STATUS_CODES.OK,
        data: userData,
        message: MESSAGES.AUTH.LOGIN_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.AUTH.LOGIN_FAILURE,
      };
    }
  }

  @Get('validate')
  @UseGuards(AuthGuard)
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'User auth validate' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.AUTH.VALIDATION_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.FORBIDDEN.code,
    description: MESSAGES.AUTH.VALIDATION_FAILURE,
  })
  async validate() {
    return true;
  }

  @Get('logout')
  @Version('1')
  @HttpCode(STATUS_CODES.OK.code)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: STATUS_CODES.OK.code,
    description: MESSAGES.AUTH.LOGOUT_SUCCESS,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST.code,
    description: MESSAGES.AUTH.LOGOUT_FAILURE,
  })
  async logout() {
    const userLogout: any = await this.authService.signOut();

    if (userLogout === 'SUCCESS') {
      return {
        ...STATUS_CODES.OK,
        message: MESSAGES.AUTH.LOGOUT_SUCCESS,
      };
    } else {
      return {
        ...STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.AUTH.LOGOUT_FAILURE,
      };
    }
  }
}
