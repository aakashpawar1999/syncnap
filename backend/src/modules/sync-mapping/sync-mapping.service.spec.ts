import { Test, TestingModule } from '@nestjs/testing';
import { SyncMappingService } from './sync-mapping.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CryptoService } from '../../common/services/crypto/crypto.service';

describe('SyncMappingService', () => {
  let service: SyncMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncMappingService,
        { provide: PrismaService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: CryptoService, useValue: {} },
        { provide: 'SUPABASE_CLIENT', useValue: {} },
      ],
    }).compile();

    service = module.get<SyncMappingService>(SyncMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
