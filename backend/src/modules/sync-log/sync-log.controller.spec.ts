import { Test, TestingModule } from '@nestjs/testing';
import { SyncLogController } from './sync-log.controller';

describe('SyncLogController', () => {
  let controller: SyncLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncLogController],
    }).compile();

    controller = module.get<SyncLogController>(SyncLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
