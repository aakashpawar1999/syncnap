import { Test, TestingModule } from '@nestjs/testing';
import { SyncMappingController } from './sync-mapping.controller';
import { SyncMappingService } from './sync-mapping.service';

describe('SyncMappingController', () => {
  let controller: SyncMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncMappingController],
      providers: [
        { provide: SyncMappingService, useValue: {} },
        { provide: 'SUPABASE_CLIENT', useValue: {} },
      ],
    }).compile();

    controller = module.get<SyncMappingController>(SyncMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
