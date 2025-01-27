import { Test, TestingModule } from '@nestjs/testing';
import { SyncService } from './sync.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { SyncLogService } from '../sync-log/sync-log.service';
import { CryptoService } from '../../common/services/crypto/crypto.service';

describe('SyncService', () => {
  let service: SyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        { provide: PrismaService, useValue: {} },
        { provide: SyncLogService, useValue: {} },
        { provide: CryptoService, useValue: {} },
        { provide: 'SUPABASE_CLIENT', useValue: {} },
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
