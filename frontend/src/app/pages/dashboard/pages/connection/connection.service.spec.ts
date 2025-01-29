import { TestBed } from '@angular/core/testing';

import { ConnectionService } from './connection.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ConnectionService', () => {
  let service: ConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(ConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
