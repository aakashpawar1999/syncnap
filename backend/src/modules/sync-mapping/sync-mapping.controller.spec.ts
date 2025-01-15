import { Test, TestingModule } from '@nestjs/testing';
import { SyncMappingController } from './sync-mapping.controller';

describe('SyncMappingController', () => {
  let controller: SyncMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncMappingController],
    }).compile();

    controller = module.get<SyncMappingController>(SyncMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
