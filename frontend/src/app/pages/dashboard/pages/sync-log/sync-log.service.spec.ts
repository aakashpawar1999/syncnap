import { TestBed } from '@angular/core/testing';

import { SyncLogService } from './sync-log.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SyncLogService', () => {
  let service: SyncLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(SyncLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
