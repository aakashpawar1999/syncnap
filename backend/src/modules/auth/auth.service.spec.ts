import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { SyncMappingService } from '../sync-mapping/sync-mapping.service';
import { ConnectionService } from '../connection/connection.service';
import { UserService } from '../user/user.service';
import { SyncService } from '../sync/sync.service';
import { CryptoService } from '../../common/services/crypto/crypto.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: CryptoService, useValue: {} },
        { provide: ConnectionService, useValue: {} },
        { provide: SyncService, useValue: {} },
        { provide: SyncMappingService, useValue: {} },
        { provide: 'SUPABASE_CLIENT', useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
