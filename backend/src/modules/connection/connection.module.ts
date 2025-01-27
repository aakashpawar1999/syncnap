import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CryptoService } from '../../common/services/crypto/crypto.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConnectionController],
  providers: [ConnectionService, PrismaService, UserService, CryptoService],
})
export class ConnectionModule {}
