import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionService } from './connection.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CryptoService } from '../../common/services/crypto/crypto.service';

describe('ConnectionService', () => {
  let service: ConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionService,
        { provide: PrismaService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: CryptoService, useValue: {} },
        { provide: 'SUPABASE_CLIENT', useValue: {} },
      ],
    }).compile();

    service = module.get<ConnectionService>(ConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
