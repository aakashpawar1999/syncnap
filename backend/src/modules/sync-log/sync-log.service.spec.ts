import { Test, TestingModule } from '@nestjs/testing';
import { SyncLogService } from './sync-log.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../user/user.service';

describe('SyncLogService', () => {
  let service: SyncLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncLogService,
        { provide: PrismaService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: 'SUPABASE_CLIENT', useValue: {} },
      ],
    }).compile();

    service = module.get<SyncLogService>(SyncLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
