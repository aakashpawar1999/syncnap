import { Test, TestingModule } from '@nestjs/testing';
import { SyncMappingService } from './sync-mapping.service';

describe('SyncMappingService', () => {
  let service: SyncMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncMappingService],
    }).compile();

    service = module.get<SyncMappingService>(SyncMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
