import { TestBed } from '@angular/core/testing';

import { SyncLogService } from './sync-log.service';

describe('SyncLogService', () => {
  let service: SyncLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
