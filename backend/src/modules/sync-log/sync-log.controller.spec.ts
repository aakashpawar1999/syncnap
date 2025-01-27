import { Test, TestingModule } from '@nestjs/testing';
import { SyncLogController } from './sync-log.controller';
import { SyncLogService } from './sync-log.service';

describe('SyncLogController', () => {
  let controller: SyncLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncLogController],
      providers: [
        { provide: SyncLogService, useValue: {} },
        { provide: 'SUPABASE_CLIENT', useValue: {} },
      ],
    }).compile();

    controller = module.get<SyncLogController>(SyncLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
